// Quiz screen: runs practice or exam sessions, handles answers, timing, and feedback.
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buildQuizSession, buildKnowledgeQuizSession, buildDtzMockSession } from '@/utils/quizEngine';
import { KNOWLEDGE_EXAM, KNOWLEDGE_PRACTICE, KNOWLEDGE_TOPIC_MIX, DTZ_EXAM } from '@/constants/quizConfig';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { languageQuestions } from '@/constants/languageQuestions';
import { knowledgeQuestions } from '@/constants/knowledgeQuestions';
import { useQuizStore } from '@/store/quizStore';
import { speakGerman, stopSpeech } from '@/utils/speech';

const OPTION_MARKER_COLORS = [COLORS.blue, COLORS.purple, COLORS.orange, COLORS.pink, COLORS.green, COLORS.red];

export default function QuizScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 390;
  const { test, mode: modeParam, session } = useLocalSearchParams<{ test?: string; mode?: string; session?: string }>();
  const mode = modeParam === 'exam' ? 'exam' : 'practice';

  const { questions, currentIndex, answers, startQuiz, submitAnswer, nextQuestion, timeUp, isFinished } =
    useQuizStore();

  const [selected, setSelected] = useState<string | null>(null);
  const [writingInput, setWritingInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    if (mode !== 'exam') return null;
    if (test === 'knowledge') return KNOWLEDGE_EXAM.timeLimitMinutes * 60;
    if (test === 'dtz') return DTZ_EXAM.timeLimitMinutes * 60;
    return null;
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [entrance] = useState(() => new Animated.Value(0));
  const hasTimer = mode === 'exam' && (test === 'knowledge' || test === 'dtz');

  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, entrance]);

  // Build a fresh randomized session once, when the screen first loads
  useEffect(() => {
    if (test === 'knowledge') {
      const totalQuestions = mode === 'exam' ? KNOWLEDGE_EXAM.totalQuestions : KNOWLEDGE_PRACTICE.totalQuestions;
      const session = buildKnowledgeQuizSession(knowledgeQuestions, totalQuestions, KNOWLEDGE_TOPIC_MIX);
      startQuiz(session, mode);
    } else if (test === 'dtz') {
      const session = buildDtzMockSession(
        languageQuestions.filter((q) => q.topic !== 'writing'),
        DTZ_EXAM.totalQuestions,
      );
      startQuiz(session, mode);
    } else if (test === 'listening') {
      const session = buildQuizSession(languageQuestions.filter((q) => q.topic === 'listening'), 10);
      startQuiz(session, mode);
    } else if (test === 'writing') {
      const session = buildQuizSession(languageQuestions.filter((q) => q.topic === 'writing'), 10);
      startQuiz(session, mode);
    } else {
      const session = buildQuizSession(languageQuestions, 10);
      startQuiz(session, mode);
    }
  }, [mode, session, startQuiz, test]);

  // Stop any audio the moment the question changes — this is the fix for
  // "it should stop at the next question but it continues": previously
  // Speech.stop() only ran on true component unmount, never on navigating
  // between questions within the same screen.
  useEffect(() => {
    stopSpeech();
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  }, [currentIndex]);

  // Stop speech if the person leaves the screen entirely
  useEffect(() => () => stopSpeech(), []);

  // Countdown timer — only runs in exam mode
  useEffect(() => {
    if (!hasTimer) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasTimer, timeUp]);

  useEffect(() => {
    if (isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeech();

      const score = String(answers.filter((a) => a.correct).length);
      const total = String(questions.length);

      // Real DTZ order: Hören+Lesen finishes, THEN Schreiben, THEN results.
      // Route into the dedicated writing task screen instead of results
      // when this was the full exam simulation.
      if (test === 'dtz' && mode === 'exam') {
        router.replace({ pathname: '/writing', params: { mode: 'exam', score, total } });
      } else {
        router.replace({
          pathname: '/results',
          params: { score, total, test: test ?? 'b1', mode },
        });
      }
    }
  }, [answers, isFinished, mode, questions.length, router, test]);

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Preparing your quiz…</Text>
      </View>
    );
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // These depend on `current`, so they must live below the line above —
  // this was the crash: they previously referenced `current` before it existed.
  const hasTranscript = 'transcriptDE' in current && !!(current as any).transcriptDE;
  const alreadyPlayed = playedIds.has(current.id);

  const handlePlay = () => {
    if (!hasTranscript || alreadyPlayed) return;
    setIsPlaying(true);
    speakGerman((current as any).transcriptDE, () => setIsPlaying(false));
    setPlayedIds((prev) => new Set(prev).add(current.id));
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
    // Played is already marked true from handlePlay — stopping early still
    // counts as their one listen, matching the real exam's single-play rule.
  };

  const handleSelect = (option: string) => {
    if (mode === 'exam') {
      if (selected !== null) return;
      setSelected(option);
      submitAnswer(option);
    } else {
      if (showFeedback) return;
      setSelected(option);
      setShowFeedback(true);
      submitAnswer(option);
    }

    advanceTimerRef.current = setTimeout(() => {
      setIsPlaying(false);
      setSelected(null);
      setShowFeedback(false);
      nextQuestion();
    }, mode === 'exam' ? 250 : 900);
  };

  const handleNext = () => {
    stopSpeech(); // belt-and-suspenders: also stop right when advancing
    setIsPlaying(false);
    setSelected(null);
    setWritingInput('');
    setShowFeedback(false);
    nextQuestion();
  };

  const handleWritingSubmit = () => {
    if (!writingInput.trim() || showFeedback) return;
    setSelected(writingInput.trim());
    setShowFeedback(true);
    submitAnswer(writingInput.trim());
  };

  const speakListeningQuestion = () => {
    stopSpeech();
    const hasRealTranscript = 'transcriptDE' in current && !!(current as any).transcriptDE;
    const textToSpeak = hasRealTranscript
      ? (current as any).transcriptDE
      : `${current.question}. Options: ${current.options.join('. ')}`;
    setIsPlaying(true);
    Speech.speak(textToSpeak, { language: 'de-DE', rate: 0.82, onDone: () => setIsPlaying(false) });
  };

  const getOptionStyle = (option: string, isHovered: boolean) => {
    if (mode === 'exam') {
      return [
        styles.option,
        isHovered && styles.optionHovered,
        option === selected && styles.optionSelectedExam,
      ];
    }
    if (!showFeedback) return [styles.option, isHovered && styles.optionHovered];
    if (option === current.correctAnswer) return [styles.option, styles.optionCorrect];
    if (option === selected) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDisabled];
  };

  const getOptionMarkerStyle = (option: string, optionIndex: number) => {
    if (showFeedback && option === current.correctAnswer) {
      return [styles.optionMarker, styles.optionMarkerCorrect];
    }
    if (showFeedback && option === selected) {
      return [styles.optionMarker, styles.optionMarkerWrong];
    }
    if (mode === 'exam' && option === selected) {
      return [styles.optionMarker, styles.optionMarkerSelected];
    }
    return [styles.optionMarker, { backgroundColor: `${OPTION_MARKER_COLORS[optionIndex % OPTION_MARKER_COLORS.length]}35`, borderColor: OPTION_MARKER_COLORS[optionIndex % OPTION_MARKER_COLORS.length] }];
  };

  const difficultyOrTopicColor =
    'difficulty' in current
      ? current.difficulty === 'easy'
        ? COLORS.green
        : current.difficulty === 'medium'
        ? COLORS.orange
        : COLORS.pink
      : current.topic === 'politics'
      ? COLORS.blue
      : current.topic === 'history'
      ? COLORS.orange
      : COLORS.green;

  const badgeLabel = 'difficulty' in current ? current.difficulty : current.topic;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isWritingQuestion = current.topic === 'writing';
  const isListeningQuestion = current.topic === 'listening';
  const isReadingQuestion = 'context' in current && Boolean(current.context);
  const canProceed = isWritingQuestion ? selected !== null : mode === 'exam' ? selected !== null : showFeedback;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, isCompactPhone && styles.scrollContentMobile]}>
        <Animated.View
          style={{
            opacity: entrance,
            transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          }}
        >
        {mode === 'exam' && secondsLeft !== null && (
          <View style={styles.timerBar}>
            <Ionicons name="time-outline" size={18} color={secondsLeft < 300 ? COLORS.red : COLORS.textPrimary} />
            <Text style={[styles.timerText, secondsLeft < 300 && { color: COLORS.red }]}>
              {formatTime(secondsLeft)}
            </Text>
          </View>
        )}

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyOrTopicColor }]}>
            <Text style={styles.difficultyText}>{String(badgeLabel).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={GRADIENTS.title}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>

        {hasTranscript && (
          <Pressable
            onPress={isPlaying ? handleStop : handlePlay}
            disabled={alreadyPlayed && !isPlaying}
            style={[styles.playButton, alreadyPlayed && !isPlaying && styles.playButtonUsed]}
          >
            <Ionicons
              name={isPlaying ? 'stop-circle' : alreadyPlayed ? 'checkmark-circle' : 'play-circle'}
              size={22}
              color={COLORS.textPrimary}
            />
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Stop' : alreadyPlayed ? 'Already played' : 'Play audio'}
            </Text>
          </Pressable>
        )}

        <LinearGradient
          colors={isReadingQuestion ? GRADIENTS.cardB : GRADIENTS.cardA}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, isCompactPhone && styles.cardMobile]}
        >
          {isReadingQuestion ? (
            <View style={styles.contextBlock}>
              <View style={styles.contextHeader}>
                <Ionicons name="book-outline" size={17} color={COLORS.orange} />
                <Text style={styles.contextLabel}>Reading passage</Text>
              </View>
              <Text style={styles.contextText}>{current.context}</Text>
            </View>
          ) : null}
          {isReadingQuestion && <Text style={styles.questionLabel}>Question</Text>}
          <Text style={[styles.questionText, isCompactPhone && styles.questionTextMobile]}>{current.question}</Text>
          {isListeningQuestion && !hasTranscript && (
            <Pressable
              onPress={isPlaying ? handleStop : speakListeningQuestion}
              style={styles.audioButton}
            >
              <Ionicons
                name={isPlaying ? 'stop-outline' : 'volume-high-outline'}
                size={19}
                color={COLORS.textPrimary}
              />
              <Text style={styles.audioButtonText}>{isPlaying ? 'Stop' : 'Play question'}</Text>
            </Pressable>
          )}
        </LinearGradient>

        {isWritingQuestion ? (
          <View style={styles.writingBlock}>
            <TextInput
              value={writingInput}
              onChangeText={setWritingInput}
              editable={!showFeedback}
              multiline
              placeholder="Write your answer in German..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.writingInput}
            />
            {!showFeedback && (
              <Pressable onPress={handleWritingSubmit} style={styles.submitWritingButton}>
                <Text style={styles.nextButtonText}>Submit answer</Text>
                <Ionicons name="checkmark" size={18} color={COLORS.textPrimary} />
              </Pressable>
            )}
          </View>
        ) : (
          <View style={{ marginTop: 20, gap: 12 }}>
            {current.options.map((option: string, optionIndex: number) => (
              <Pressable
                key={option}
                onPress={() => handleSelect(option)}
                onHoverIn={() => setHoveredOption(option)}
                onHoverOut={() => setHoveredOption(null)}
                style={({ pressed }) => [
                  ...getOptionStyle(option, hoveredOption === option),
                  isCompactPhone && styles.optionCompact,
                  pressed && styles.optionPressed,
                ]}
              >
                <View style={getOptionMarkerStyle(option, optionIndex)}>
                  <Text style={styles.optionMarkerText}>{String.fromCharCode(65 + optionIndex)}</Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
                {mode === 'practice' && showFeedback && option === current.correctAnswer && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.textPrimary} />
                )}
                {mode === 'practice' && showFeedback && option === selected && option !== current.correctAnswer && (
                  <Ionicons name="close-circle" size={20} color={COLORS.textPrimary} />
                )}
                {(!showFeedback || (option !== current.correctAnswer && option !== selected)) && (
                  <Ionicons name="chevron-forward" size={19} color={COLORS.textSecondary} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {isWritingQuestion && canProceed && (
          <Pressable onPress={handleNext} style={styles.nextButtonWrap}>
            <LinearGradient colors={GRADIENTS.buttonA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>
                {currentIndex + 1 === questions.length ? 'Finish' : 'Next Question'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} />
            </LinearGradient>
          </Pressable>
        )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  scrollContent: { padding: 20 },
  scrollContentMobile: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 28 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: COLORS.textSecondary, fontSize: 16 },
  timerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.bgCard, borderRadius: 12, paddingVertical: 10, marginBottom: 16,
  },
  playButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.blue, borderRadius: 12, paddingVertical: 12, marginBottom: 16,
  },
  playButtonUsed: { backgroundColor: COLORS.bgCard, opacity: 0.7 },
  playButtonText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  timerText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressText: { color: COLORS.textSecondary, fontSize: 14 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  difficultyText: { color: COLORS.textPrimary, fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: COLORS.bgCard, overflow: 'hidden', marginBottom: 24 },
  progressFill: { height: '100%', borderRadius: 4 },
  card: { padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardMobile: { padding: 18 },
  contextBlock: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  contextHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  contextLabel: { color: COLORS.orange, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  contextText: { color: COLORS.textPrimary, fontSize: 16, lineHeight: 26 },
  questionLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7 },
  questionText: { color: COLORS.textPrimary, fontSize: 19, fontWeight: '600', lineHeight: 26 },
  questionTextMobile: { fontSize: 17, lineHeight: 24 },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.82)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.22)', borderRadius: 14, padding: 16,
    minHeight: 58,
  },
  optionCompact: { paddingVertical: 12, paddingHorizontal: 12 },
  optionMarker: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(148,163,184,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.26)',
  },
  optionMarkerText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '800' },
  optionMarkerSelected: { backgroundColor: 'rgba(59,130,246,0.3)', borderColor: COLORS.blue },
  optionMarkerCorrect: { backgroundColor: 'rgba(16,185,129,0.3)', borderColor: COLORS.green },
  optionMarkerWrong: { backgroundColor: 'rgba(239,68,68,0.3)', borderColor: COLORS.red },
  optionHovered: { backgroundColor: 'rgba(59,130,246,0.16)', borderColor: 'rgba(96,165,250,0.75)', transform: [{ translateY: -2 }] },
  optionPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  optionSelectedExam: { borderColor: COLORS.blue, backgroundColor: 'rgba(59,130,246,0.15)' },
  optionCorrect: { backgroundColor: 'rgba(16,185,129,0.2)', borderColor: COLORS.green },
  optionWrong: { backgroundColor: 'rgba(239,68,68,0.2)', borderColor: COLORS.red },
  optionDisabled: { opacity: 0.5 },
  optionText: { color: COLORS.textPrimary, fontSize: 15, flex: 1 },
  nextButtonWrap: { marginTop: 24 },
  audioButton: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, marginTop: 18,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.16)',
  },
  audioButtonText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  writingBlock: { marginTop: 20, gap: 12 },
  writingInput: {
    minHeight: 130, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 16,
    color: COLORS.textPrimary, backgroundColor: COLORS.bgCard, textAlignVertical: 'top', fontSize: 16,
  },
  submitWritingButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14, backgroundColor: COLORS.blue,
  },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  nextButtonText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600' },
});