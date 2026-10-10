// Writing screen: guides a timed DTZ writing task through drafting and self-review.
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, useWindowDimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, GRADIENTS } from '@/constants/theme';

// The two real official DTZ Schreiben tasks — you choose one, matching
// "Wählen Sie eine Aufgabe aus: Aufgabe A oder Aufgabe B."
const WRITING_TASKS = {
  A: {
    title: 'Aufgabe A',
    scenario:
      'Sie besuchen einen Deutschkurs. Sie können diese Woche nicht mehr in den Kurs kommen. Deshalb schreiben Sie an Ihre Lehrerin Frau Meinert.',
    points: ['Grund für Ihr Schreiben', 'Entschuldigung', 'Hausaufgaben', 'Rückkehr in den Kurs'],
  },
  B: {
    title: 'Aufgabe B',
    scenario:
      'Ihre frühere Deutschlehrerin Frau Berg hat bald Geburtstag. Sie möchte eine Geburtstagsparty feiern und hat Ihnen eine Einladung geschickt. Antworten Sie auf diese Einladung.',
    points: ['Grund für Ihr Schreiben', 'Was Sie im Moment tun', 'Kommen Sie?', 'Bitte um Wegbeschreibung'],
  },
};

const TIME_LIMIT_MINUTES = 30; // real official time for the Schreiben section

// The real official rubric (Bewertungskriterien Schreiben), condensed into
// a self-check — since grading open-ended German prose accurately isn't
// something a rules-based app can honestly automate, this lets the writer
// (or a teacher/study partner) judge their own text against the same
// criteria a real DTZ examiner uses.
const SELF_CHECK_ITEMS = [
  'I addressed all 4 required points from the task',
  'My German is understandable even where I made small mistakes',
  'I used appropriate greetings/closing (Sehr geehrte.../Mit freundlichen Grüßen)',
  'I connected sentences using und, aber, weil, deshalb (not just short fragments)',
  'My spelling and punctuation are clear enough to follow easily',
];

type Phase = 'choose' | 'writing' | 'submitted';

export default function WritingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 390;
  const { mode, score, total } = useLocalSearchParams<{ mode?: string; score?: string; total?: string }>();
  const isExam = mode === 'exam';

  const [phase, setPhase] = useState<Phase>('choose');
  const [taskKey, setTaskKey] = useState<'A' | 'B' | null>(null);
  const [text, setText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT_MINUTES * 60);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [entrance] = useState(() => new Animated.Value(0));

  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [entrance, phase]);

  useEffect(() => {
    if (phase !== 'writing' || !isExam) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('submitted');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isExam]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const toggleCheck = (i: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const task = taskKey ? WRITING_TASKS[taskKey] : null;

  if (phase === 'choose') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={[styles.animatedContent, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          <View style={[styles.screenHeader, isCompactPhone && styles.screenHeaderMobile]}>
            <View style={styles.headerIcon}>
              <Ionicons name="pencil" size={20} color={COLORS.textPrimary} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>DTZ · Schreiben</Text>
              <Text style={styles.heading}>Choose a writing task</Text>
            </View>
          </View>
          <Text style={styles.subheading}>Read both prompts, then choose the one you can answer most confidently.</Text>

          {(['A', 'B'] as const).map((key) => (
            <Pressable
              key={key}
              onPress={() => {
                setTaskKey(key);
                setPhase('writing');
              }}
              accessibilityRole="button"
              accessibilityLabel={`Start ${WRITING_TASKS[key].title}`}
              style={({ pressed }) => [styles.taskCard, pressed && styles.cardPressed]}
            >
              <View style={styles.taskCardHeader}>
                <View style={styles.taskBadge}><Text style={styles.taskBadgeText}>{key}</Text></View>
                <Text style={styles.taskTitle}>{WRITING_TASKS[key].title}</Text>
                <Ionicons name="arrow-forward-circle-outline" size={24} color={COLORS.cyan} />
              </View>
              <Text style={styles.taskScenario}>{WRITING_TASKS[key].scenario}</Text>
              <View style={styles.pointsBlock}>
                <Text style={styles.pointsLabel}>Include in your answer</Text>
                {WRITING_TASKS[key].points.map((p) => (
                  <View key={p} style={styles.taskPointRow}>
                    <Ionicons name="checkmark" size={15} color={COLORS.green} />
                    <Text style={styles.taskPoint}>{p}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'writing' && task) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={[styles.animatedContent, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          <View style={[styles.topBar, isCompactPhone && styles.topBarMobile]}>
            <View>
              <Text style={styles.eyebrow}>DTZ · Schreiben</Text>
              <Text style={styles.heading}>Write your answer</Text>
            </View>
            {isExam && (
              <View style={[styles.timerBar, secondsLeft < 300 && styles.timerWarning]}>
                <Ionicons name="time-outline" size={17} color={secondsLeft < 300 ? COLORS.red : COLORS.cyan} />
                <Text style={[styles.timerText, secondsLeft < 300 && { color: COLORS.red }]}>{formatTime(secondsLeft)}</Text>
              </View>
            )}
          </View>

          <View style={styles.taskCard}>
            <View style={styles.taskCardHeader}>
              <View style={styles.taskBadge}><Text style={styles.taskBadgeText}>{taskKey}</Text></View>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
            <Text style={styles.taskScenario}>{task.scenario}</Text>
            <View style={styles.pointsBlock}>
              <Text style={styles.pointsLabel}>Your message should include</Text>
              {task.points.map((p) => (
                <View key={p} style={styles.taskPointRow}>
                  <Ionicons name="checkmark" size={15} color={COLORS.green} />
                  <Text style={styles.taskPoint}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.editorHeader, isCompactPhone && styles.editorHeaderMobile]}>
            <View>
              <Text style={styles.editorTitle}>Your response</Text>
              <Text style={styles.editorHint}>Write in German and address every point.</Text>
            </View>
            <Text style={styles.wordCount}>{wordCount} words</Text>
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Schreiben Sie hier Ihren Text…"
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.textArea, isCompactPhone && styles.textAreaMobile]}
            textAlignVertical="top"
          />

          <Pressable
            onPress={() => setPhase('submitted')}
            disabled={!text.trim()}
            accessibilityRole="button"
            accessibilityLabel="Submit writing response"
            style={[styles.submitWrap, !text.trim() && styles.submitDisabled]}
          >
            <LinearGradient colors={GRADIENTS.buttonA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
              <Ionicons name="checkmark" size={18} color={COLORS.textPrimary} />
            </LinearGradient>
          </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // phase === 'submitted'
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.animatedContent, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
        <View style={[styles.screenHeader, isCompactPhone && styles.screenHeaderMobile]}>
          <View style={[styles.headerIcon, styles.successIcon]}>
            <Ionicons name="checkmark" size={20} color={COLORS.textPrimary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Writing complete</Text>
            <Text style={styles.heading}>Review your answer</Text>
          </View>
        </View>
        <View style={styles.taskCard}>
          <Text style={styles.pointsLabel}>Your response</Text>
          <Text style={styles.taskScenario}>{text || '(no text written)'}</Text>
        </View>

        <View style={[styles.assessmentHeader, isCompactPhone && styles.assessmentHeaderMobile]}>
          <View>
            <Text style={styles.heading}>Self-assessment</Text>
            <Text style={styles.subheading}>Check each criterion before continuing.</Text>
          </View>
          <Text style={styles.progressText}>{checkedItems.size}/{SELF_CHECK_ITEMS.length}</Text>
        </View>

        {SELF_CHECK_ITEMS.map((item, i) => (
          <Pressable key={i} onPress={() => toggleCheck(i)} accessibilityRole="checkbox" accessibilityState={{ checked: checkedItems.has(i) }} style={styles.checkRow}>
            <Ionicons
              name={checkedItems.has(i) ? 'checkbox' : 'square-outline'}
              size={22}
              color={checkedItems.has(i) ? COLORS.green : COLORS.textSecondary}
            />
            <Text style={styles.checkText}>{item}</Text>
          </Pressable>
        ))}

        <Pressable
    onPress={() =>
        router.replace({
            pathname: '/results',
            params: {
            score: score ?? '0',
            total: total ?? '0',
            test: 'dtz',
            mode,
            writingChecked: String(checkedItems.size),
            writingTotal: String(SELF_CHECK_ITEMS.length),
    },
  })
}
          style={styles.submitWrap}
        >
          <LinearGradient colors={GRADIENTS.buttonB} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
            <Text style={styles.submitText}>Continue to results</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} />
          </LinearGradient>
        </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  animatedContent: { width: '100%' },
  content: { padding: 20, maxWidth: 640, width: '100%', alignSelf: 'center' },
  contentMobile: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24 },
  screenHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 16 },
  screenHeaderMobile: { alignItems: 'flex-start' },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.blue },
  successIcon: { backgroundColor: COLORS.green },
  headerCopy: { flex: 1 },
  eyebrow: { color: COLORS.cyan, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  heading: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subheading: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 16 },
  topBarMobile: { flexDirection: 'column', alignItems: 'flex-start', gap: 12 },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(6,182,212,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.35)',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  timerWarning: { backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)' },
  timerText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  taskCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
  },
  cardPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  taskCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  taskBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.5)' },
  taskBadgeText: { color: COLORS.cyan, fontSize: 15, fontWeight: '800' },
  taskTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 8 },
  taskScenario: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 20 },
  pointsBlock: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 5 },
  pointsLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  taskPointRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  taskPoint: { color: COLORS.textSecondary, fontSize: 13, flex: 1 },
  editorHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 },
  editorHeaderMobile: { flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  editorTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  editorHint: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  textArea: {
    minHeight: 250,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    padding: 16,
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 23,
  },
  textAreaMobile: { minHeight: 200, fontSize: 14, lineHeight: 20 },
  wordCount: { color: COLORS.cyan, fontSize: 12, fontWeight: '700' },
  submitWrap: { marginTop: 8 },
  submitDisabled: { opacity: 0.45 },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  submitText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  assessmentHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 },
  assessmentHeaderMobile: { alignItems: 'flex-start', gap: 8 },
  progressText: { color: COLORS.green, fontSize: 16, fontWeight: '800' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkText: { color: COLORS.textPrimary, fontSize: 13, flex: 1, lineHeight: 18 },
});