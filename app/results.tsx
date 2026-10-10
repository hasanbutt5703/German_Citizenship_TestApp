// Results screen: summarizes the session score, pass status, and answer breakdown.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KNOWLEDGE_EXAM, DTZ_EXAM } from '@/constants/quizConfig';

import { COLORS, GRADIENTS } from '@/constants/theme';
import { useQuizStore } from '@/store/quizStore';

function ScoreRing({
  percentage,
  passed,
  size,
}: {
  percentage: number;
  passed: boolean;
  size: number;
}) {
  const strokeWidth = size * 0.075;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const ringColor = passed ? COLORS.green : COLORS.orange;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.bgCard}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(100, Math.max(0, percentage)) / 100)}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={[styles.scorePercentage, { fontSize: size * 0.24 }]}>{percentage}%</Text>
      </View>
    </View>
  );
}

function StatPill({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <View style={styles.statPill}>
      <View style={[styles.statIconWrap, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color={COLORS.textPrimary} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function BreakdownRow({
  index,
  question,
  correctAnswer,
  selected,
  isCorrect,
}: {
  index: number;
  question: string;
  correctAnswer: string;
  selected?: string;
  isCorrect: boolean;
}) {
  return (
    <View style={[styles.breakdownRow, isCorrect ? styles.breakdownRowCorrect : styles.breakdownRowWrong]}>
      <View style={[styles.breakdownIconWrap, { backgroundColor: isCorrect ? COLORS.green : COLORS.red }]}>
        <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={14} color={COLORS.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.breakdownQuestion}>
          {index + 1}. {question}
        </Text>
        <View style={styles.answerBlock}>
          <Text style={styles.answerLabel}>Correct answer</Text>
          <Text style={styles.correctAnswer}>{correctAnswer}</Text>
          {!isCorrect && selected ? (
            <>
              <Text style={styles.answerLabel}>Your answer</Text>
              <Text style={styles.selectedAnswer}>{selected}</Text>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function ResultsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const isCompactPhone = width < 390;
  const [entrance] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const { score, total, test, mode, writingChecked, writingTotal } = useLocalSearchParams<{
    score?: string;
    total?: string;
    test?: string;
    mode?: string;
    writingChecked?: string;
    writingTotal?: string;
  }>();
  const reset = useQuizStore((s) => s.reset);
  const answers = useQuizStore((s) => s.answers);
  const questions = useQuizStore((s) => s.questions);

  const scoreNum = Number(score ?? 0);
  const totalNum = Number(total ?? 0);
  const writingCheckedNum = Number(writingChecked ?? 0);
  const writingTotalNum = Number(writingTotal ?? 0);
  const percentage = totalNum > 0 ? Math.round((scoreNum / totalNum) * 100) : 0;
  const wrongCount = totalNum - scoreNum;

 const dtzLevel: 'B1' | 'A2' | 'none' =
  test === 'dtz' && mode === 'exam'
    ? scoreNum >= DTZ_EXAM.passCountB1
      ? 'B1'
      : scoreNum >= DTZ_EXAM.passCountA2
      ? 'A2'
      : 'none'
    : 'none';

const passed =
  test === 'dtz' && mode === 'exam'
    ? dtzLevel !== 'none'
    : test === 'knowledge' && mode === 'exam'
    ? percentage >= KNOWLEDGE_EXAM.passPercentage
    : percentage >= 60;

  const resultColor = passed ? COLORS.green : COLORS.orange;

  const resultTitle = test === 'dtz'
    ? 'B1 Language Test'
    : test === 'knowledge'
    ? 'Knowledge Test'
    : 'Practice Result';

  const targetLabel = test === 'dtz' && mode === 'exam'
    ? `A2 from ${DTZ_EXAM.passCountA2}/${DTZ_EXAM.totalQuestions} · B1 from ${DTZ_EXAM.passCountB1}/${DTZ_EXAM.totalQuestions}`
    : test === 'knowledge' && mode === 'exam'
    ? `${KNOWLEDGE_EXAM.passCount}/${KNOWLEDGE_EXAM.totalQuestions} correct to pass`
    : '60% correct to pass practice';

  const statusLabel =
  test === 'dtz' && mode === 'exam'
    ? dtzLevel === 'B1'
      ? 'Level B1 achieved'
      : dtzLevel === 'A2'
      ? 'Level A2 achieved'
      : 'Below A2 — not yet certified'
    : passed
    ? 'Passed'
    : 'Not passed yet';

  const handleRetake = () => {
    reset();
    router.replace({
      pathname: '/quiz',
      params: {
        test: test ?? 'b1',
        mode: mode ?? 'practice',
        session: String(Date.now()),
      },
    });
  };

  const handleHome = () => {
    reset();
    router.replace('/');
  };

  const ringSize = isDesktop ? 200 : 172;

  const summaryCard = (
    <View
      style={[
        styles.summaryCard,
        isDesktop && styles.summaryCardDesktop,
        isCompactPhone && styles.summaryCardMobile,
      ]}
    >
      <View style={styles.resultHeader}>
        <View style={[styles.resultHeaderIcon, { backgroundColor: resultColor }]}>
          <Ionicons name={test === 'knowledge' ? 'school-outline' : 'chatbubble-ellipses-outline'} size={20} color={COLORS.textPrimary} />
        </View>
        <View style={styles.resultHeaderText}>
          <Text style={styles.resultEyebrow}>RESULTS</Text>
          <Text style={styles.resultTitle}>{resultTitle}</Text>
        </View>
      </View>

      <ScoreRing percentage={percentage} passed={passed} size={ringSize} />

      <View style={styles.statusBadge}>
        <Ionicons name={passed ? 'checkmark-circle' : 'alert-circle'} size={20} color={resultColor} />
        <Text style={[styles.statusText, { color: resultColor }]}>{statusLabel}</Text>
      </View>

      <Text style={styles.summaryText}>
        {passed
          ? "Solid result — you're on track. A little more practice will keep it sharp."
          : 'Review the questions you missed below, then run it back.'}
      </Text>

      <View style={styles.targetNote}>
        <Ionicons name="flag-outline" size={15} color={COLORS.cyan} />
        <Text style={styles.targetNoteText}>{targetLabel}</Text>
      </View>

      {writingTotalNum > 0 && (
        <Text style={styles.writingSummary}>
          Writing self-check: {writingCheckedNum}/{writingTotalNum} criteria checked
        </Text>
      )}

      <View style={styles.statsRow}>
        <StatPill icon="checkmark" label="Correct" value={String(scoreNum)} color={COLORS.green} />
        <StatPill icon="close" label="Missed" value={String(wrongCount)} color={COLORS.red} />
        <StatPill icon="list" label="Total" value={String(totalNum)} color={COLORS.blue} />
      </View>

      <View style={[styles.actionsRow, isDesktop && styles.actionsRowDesktop, isCompactPhone && styles.actionsRowMobile]}>
        <Pressable onPress={handleRetake} style={styles.buttonWrap}>
          <LinearGradient
            colors={GRADIENTS.buttonA}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Ionicons name="refresh" size={18} color={COLORS.textPrimary} />
            <Text style={styles.buttonText}>Retake quiz</Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={handleHome} style={styles.buttonWrap}>
          <View style={styles.secondaryButton}>
            <Ionicons name="home-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.secondaryButtonText}>Back to home</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );

  const breakdownList = (
    <View
      style={[
        styles.breakdownCard,
        isDesktop && styles.breakdownCardDesktop,
      ]}
    >
      <View style={styles.breakdownHeader}>
        <View>
          <Text style={styles.breakdownTitle}>Question breakdown</Text>
          <Text style={styles.breakdownSubtitle}>Review each answer and the correct solution.</Text>
        </View>
        <View style={styles.breakdownCount}>
          <Text style={styles.breakdownCountText}>{scoreNum}/{totalNum}</Text>
        </View>
      </View>
      {questions.map((q, i) => {
        const answer = answers[i];
        return (
          <BreakdownRow
            key={q.id}
            index={i}
            question={q.question}
            correctAnswer={q.correctAnswer}
            selected={answer?.selected}
            isCorrect={!!answer?.correct}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
          isCompactPhone && styles.scrollContentMobile,
        ]}
      >
        <Animated.View
          style={{
            opacity: entrance,
            transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
            width: '100%',
          }}
        >
        {isDesktop ? (
          <View style={styles.desktopRow}>
            <View style={styles.desktopLeftCol}>{summaryCard}</View>
            <View style={styles.desktopRightCol}>{breakdownList}</View>
          </View>
        ) : (
          <>
            {summaryCard}
            {breakdownList}
          </>
        )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  scrollContent: { padding: 20, alignItems: 'center' },
  scrollContentMobile: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24 },
  scrollContentDesktop: { padding: 32, alignItems: 'stretch' },

  desktopRow: {
    flexDirection: 'row',
    gap: 24,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  desktopLeftCol: { flex: 4 },
  desktopRightCol: { flex: 5 },

  // Summary card
  summaryCard: {
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
  },
  summaryCardMobile: { padding: 16 },
  summaryCardDesktop: { maxWidth: '100%', position: 'relative' },

  ringCenter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  scorePercentage: { color: COLORS.textPrimary, fontWeight: '800' },

  resultHeader: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: 12, marginBottom: 20 },
  resultHeaderIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  resultHeaderText: { flex: 1 },
  resultEyebrow: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  resultTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 2 },

  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 6 },
  statusText: { fontSize: 17, fontWeight: '700' },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  writingSummary: {
    color: COLORS.textPrimary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  targetNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(6,182,212,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.24)',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginBottom: 20,
  },
  targetNoteText: { flex: 1, color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginBottom: 24,
  },
  statPill: {
    flex: 1,
    minWidth: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgMain,
    borderRadius: 14,
    padding: 10,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  statLabel: { color: COLORS.textSecondary, fontSize: 11 },

  actionsRow: { width: '100%', gap: 10 },
  actionsRowDesktop: { flexDirection: 'row' },
  actionsRowMobile: { flexDirection: 'column' },
  buttonWrap: { flex: 1 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '600' },

  // Breakdown card
  breakdownCard: {
    width: '100%',
    maxWidth: 460,
    marginTop: 20,
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  breakdownCardDesktop: { maxWidth: '100%', marginTop: 0 },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  breakdownTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  breakdownSubtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  breakdownCount: { minWidth: 52, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: 'rgba(59,130,246,0.16)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', alignItems: 'center' },
  breakdownCountText: { color: COLORS.blue, fontSize: 12, fontWeight: '800' },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  breakdownRowCorrect: { backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' },
  breakdownRowWrong: { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' },
  breakdownIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  breakdownQuestion: { color: COLORS.textPrimary, fontSize: 13.5, lineHeight: 19 },
  answerBlock: { marginTop: 8, gap: 2 },
  answerLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600' },
  correctAnswer: { color: COLORS.green, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  selectedAnswer: { color: COLORS.red, fontSize: 13, fontWeight: '600' },
});