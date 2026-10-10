// Home screen: presents the available tests and starts a learner's chosen session.
import React from 'react';
import { Image } from 'expo-image';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
  Animated,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS } from '@/constants/theme';

const languageTestFacts = [
  { id: 'speaking', icon: 'mic-outline', title: 'Speaking', subtitle: '75–100 points to pass' },
  { id: 'listening', icon: 'headset-outline', title: 'Listening & Reading', subtitle: '33–45 points to pass' },
  { id: 'writing', icon: 'pencil-outline', title: 'Writing', subtitle: '15–20 points to pass' },
];

const knowledgeTestFacts = [
  { id: 'questions', icon: 'list-outline', title: '33 questions', color: COLORS.purple },
  { id: 'time', icon: 'time-outline', title: '60 minutes', color: COLORS.orange },
  { id: 'pass', icon: 'checkmark-circle-outline', title: '17/33 correct to pass', color: COLORS.green },
];

function BackgroundImage() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.backgroundArt]} pointerEvents="none">
      <Image
        source={require('@/assets/images/Background_Image2.jpg')}
        contentFit="cover"
        contentPosition="center"
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={['rgba(15,23,42,0.34)', 'rgba(15,23,42,0.58)', 'rgba(15,23,42,0.92)']}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

function GradientTitle({
  text,
  maxFontSize = 26,
  screenWidth,
}: {
  text: string;
  maxFontSize?: number;
  screenWidth: number;
}) {
  const availableWidth = Math.max(40, Math.min(screenWidth - 40, 560));

  const estimatedCharWidth = 0.56;
  const fittedFontSize = Math.floor(availableWidth / (text.length * estimatedCharWidth));
  const fontSize = Math.max(14, Math.min(maxFontSize, fittedFontSize));

  const webGradientStyle = Platform.OS === 'web'
    ? {
        backgroundImage: `linear-gradient(90deg, ${GRADIENTS.title.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : undefined;

  return <Text style={[styles.appTitle, { fontSize, maxWidth: availableWidth }, webGradientStyle]}>{text}</Text>;
}

function FactRow({ icon, title, subtitle, iconBg }: { icon: any; title: string; subtitle?: string; iconBg: string }) {
  return (
    <View style={styles.factRow}>
      <View style={[styles.factIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={17} color={COLORS.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.factTitle}>{title}</Text>
        {subtitle ? <Text style={styles.factSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

function GradientButton({
  colors,
  label,
  onPress,
}: {
  colors: readonly [string, string, ...string[]];
  label: string;
  onPress: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.buttonWrap, hovered && styles.buttonHovered, pressed && styles.buttonPressed]}
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
        <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} />
      </LinearGradient>
    </Pressable>
  );
}

function PracticeButton({
  icon,
  label,
  colors,
  onPress,
  compact = false,
}: {
  icon: any;
  label: string;
  colors: readonly [string, string, ...string[]];
  onPress: () => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.practiceButton,
        compact && styles.practiceButtonCompact,
        hovered && styles.practiceButtonHovered,
        pressed && styles.practiceButtonPressed,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.practiceButtonSurface, compact && styles.practiceButtonSurfaceCompact]}
      >
        <View style={[styles.practiceIconWrap, compact && styles.practiceIconWrapCompact]}>
          <Ionicons name={icon} size={compact ? 16 : 18} color={COLORS.textPrimary} />
        </View>
        <Text style={[styles.practiceButtonText, compact && styles.practiceButtonTextCompact]}>{label}</Text>
        <Ionicons name="arrow-forward" size={compact ? 15 : 17} color={COLORS.textPrimary} />
      </LinearGradient>
    </Pressable>
  );
}

function TestCard({
  badge,
  gradient,
  icon,
  title,
  description,
  facts,
  factColor,
  buttonGradient,
  buttonLabel,
  onStart,
}: {
  badge: string;
  gradient: readonly [string, string, ...string[]];
  icon: any;
  title: string;
  description: string;
  facts: { id: string; icon: any; title: string; subtitle?: string; color?: string }[];
  factColor?: string;
  buttonGradient: readonly [string, string, ...string[]];
  buttonLabel: string;
  onStart: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} style={{ flex: 1 }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, hovered && styles.cardHovered]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>

        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderIcon}>
            <Ionicons name={icon} size={22} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        <Text style={styles.cardDescription}>{description}</Text>

        <View style={styles.factsBlock}>
          {facts.map((item) => (
            <FactRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              iconBg={item.color ?? factColor ?? 'rgba(255,255,255,0.16)'}
            />
          ))}
        </View>

        <GradientButton colors={buttonGradient} label={buttonLabel} onPress={onStart} />
      </LinearGradient>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Divider between the two cards. Previously the vertical line used
// `position: absolute, top: 0, bottom: 0` inside a container with no height
// of its own — it borrowed height from `alignItems: 'stretch'` on the row,
// which could measure as 0 for a frame right after `router.replace('/')`
// remounts this screen, making the line vanish. Now the line is a normal
// (non-absolute) flex child, so its height is self-contained and can't
// collapse regardless of remount timing.
// ---------------------------------------------------------------------------
function Divider({ horizontal, showOr = true }: { horizontal: boolean; showOr?: boolean }) {
  return (
    <View style={[styles.dividerContainer, horizontal && styles.dividerContainerHorizontal]}>
      <LinearGradient
        colors={[COLORS.blue, COLORS.purple, COLORS.pink, COLORS.orange]}
        start={{ x: 0, y: 0 }}
        end={horizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }}
        style={horizontal ? styles.dividerLineHorizontal : styles.dividerLineVertical}
      />
      {showOr && (
        <View style={styles.orBadge}>
          <Text style={styles.orText}>OR</Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = React.useRef<ScrollView>(null);
  const [entrance] = React.useState(() => new Animated.Value(0));
  const { width } = useWindowDimensions();
  const isHydrated = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const layoutWidth = isHydrated ? width : 1000;
  const isNarrow = layoutWidth < 700;
  const isCompactPhone = layoutWidth < 420;
  const isTablet = layoutWidth >= 700 && layoutWidth < 1000;
  const isDesktop = layoutWidth >= 1000;

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  React.useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: 720,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [entrance]);

  const titleMotion = {
    opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  };
  const cardsMotion = {
    opacity: entrance.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 0, 1] }),
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
  };
  const practiceMotion = {
    opacity: entrance.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0, 1] }),
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [34, 0] }) }],
  };

  return (
    <View style={styles.container}>
      <BackgroundImage />

      <ScrollView
        ref={scrollRef}
        style={styles.pageScroll}
        contentContainerStyle={[styles.scrollContent, isCompactPhone && styles.scrollContentMobile]}
        showsVerticalScrollIndicator
        persistentScrollbar
        indicatorStyle="white"
      >
        <View
          style={[
            styles.pageInner,
            isDesktop && styles.pageInnerDesktop,
            isTablet && styles.pageInnerTablet,
          ]}
        >
          <View style={[styles.header, isCompactPhone && styles.headerMobile]}>
            <View style={[styles.headerLeft, isCompactPhone && styles.headerLeftMobile]}>
              <View style={[styles.headerIcon, isCompactPhone && styles.headerIconMobile]}>
                <Image
                  source={require('@/assets/images/favicon.png')}
                  contentFit="contain"
                  style={styles.headerImage}
                  accessibilityLabel="German citizenship emblem"
                />
              </View>
              <Text style={[styles.headerText, isCompactPhone && styles.headerTextMobile]}>German citizenship prep</Text>
            </View>
          </View>

          <Animated.View style={[styles.titleBlock, titleMotion, isCompactPhone && styles.titleBlockMobile]}>
            <Text style={[styles.welcome, isCompactPhone && styles.welcomeMobile]}>Welcome to</Text>
            <GradientTitle
              text="German Citizenship Test App"
              maxFontSize={isCompactPhone ? 22 : 26}
              screenWidth={layoutWidth}
            />
            <Text style={[styles.subtitle, isCompactPhone && styles.subtitleMobile]}>Build confidence for your next step</Text>
            <LinearGradient
              colors={GRADIENTS.title}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.underline, isCompactPhone && styles.underlineMobile]}
            />
          </Animated.View>

          <Animated.View style={[styles.sectionHeading, cardsMotion, isCompactPhone && styles.sectionHeadingMobile]}>
            <View>
              <Text style={[styles.sectionTitle, isCompactPhone && styles.sectionTitleMobile]}>Choose your exam</Text>
              <Text style={styles.sectionSubtitle}>Full test mode</Text>
            </View>
            <Ionicons name="arrow-down-outline" size={20} color={COLORS.textSecondary} />
          </Animated.View>

          <Animated.View style={[styles.cardsRow, isNarrow && styles.cardsRowStacked, cardsMotion, isCompactPhone && styles.cardsRowCompact]}>
            <TestCard
              badge="A"
              gradient={GRADIENTS.cardA}
              icon="chatbubble-ellipses-outline"
              title="B1 Language Test"
              description="DTZ · Deutsch-Test für Zuwanderer — the official German language exam."
              facts={languageTestFacts}
              buttonGradient={GRADIENTS.buttonA}
              buttonLabel="Start language test"
              onStart={() => router.push({ pathname: '/quiz', params: { test: 'dtz', mode: 'exam' } })}
            />

            <Divider horizontal={isNarrow} />

            <TestCard
              badge="B"
              gradient={GRADIENTS.cardB}
              icon="school-outline"
              title="Knowledge Test"
              description="Einbürgerungstest — questions on German law, history and society."
              facts={knowledgeTestFacts}
              buttonGradient={GRADIENTS.buttonB}
              buttonLabel="Start knowledge test"
              onStart={() => router.push({ pathname: '/quiz', params: { test: 'knowledge', mode: 'exam' } })}
            />
          </Animated.View>

          <Animated.View style={cardsMotion}>
            <Divider horizontal showOr={false} />
          </Animated.View>

          <Animated.View style={[styles.sectionHeading, styles.practiceHeading, practiceMotion, isCompactPhone && styles.sectionHeadingMobile]}>
            <View>
              <Text style={[styles.sectionTitle, isCompactPhone && styles.sectionTitleMobile]}>Practice by skill</Text>
              <Text style={styles.sectionSubtitle}>Short sessions for focused progress</Text>
            </View>
            <Ionicons name="flash-outline" size={20} color={COLORS.orange} />
          </Animated.View>

          <Animated.View style={[styles.practiceRow, practiceMotion, isCompactPhone && styles.practiceRowMobile]}>
            <PracticeButton
              icon="book-outline"
              label="Practice language questions"
              colors={GRADIENTS.buttonA}
              compact={isCompactPhone}
              onPress={() => router.push({ pathname: '/quiz', params: { test: 'b1' } })}
            />
            <PracticeButton
              icon="headset-outline"
              label="Practice listening questions"
              colors={GRADIENTS.buttonB}
              compact={isCompactPhone}
              onPress={() => router.push({ pathname: '/quiz', params: { test: 'listening' } })}
            />
            <PracticeButton
              icon="pencil-outline"
              label="Practice writing test"
              colors={GRADIENTS.buttonA}
              compact={isCompactPhone}
              onPress={() => router.push({ pathname: '/writing', params: { mode: 'practice' } })}
            />
            <PracticeButton
              icon="list-outline"
              label="Practice knowledge questions"
              colors={GRADIENTS.buttonB}
              compact={isCompactPhone}
              onPress={() => router.push({ pathname: '/quiz', params: { test: 'knowledge' } })}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain, alignItems: 'center' },
  backgroundArt: { overflow: 'hidden' },
  backgroundImage: { opacity: 0.32 },
  pageScroll: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    // @ts-ignore -- reserves scrollbar space up front so Chrome, Edge and
    // Firefox all compute the same available content width instead of the
    // page shifting once a vertical scrollbar appears
    scrollbarGutter: 'stable',
    // @ts-ignore -- web-only scrollbar styling
    scrollbarWidth: 'thin',
    // @ts-ignore -- web-only scrollbar styling
    scrollbarColor: `${COLORS.cyan} ${COLORS.bgCard}`,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  scrollContentMobile: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 32 },
  pageInner: {
    width: '100%',
    maxWidth: '100%',
    // 'center' (not 'stretch') actively re-centers this block regardless of
    // any small difference in how a browser computes the parent's width
    alignSelf: 'center',
  },
  pageInnerDesktop: { maxWidth: 1000 },
  pageInnerTablet: { maxWidth: 840 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerMobile: { marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLeftMobile: { flex: 1, justifyContent: 'center' },
  headerIcon: {
    width: 76,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconMobile: { width: 66, height: 32, borderRadius: 9 },
  headerImage: { width: '100%', height: '100%', borderRadius: 9 },
  headerText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
  headerTextMobile: { fontSize: 12, letterSpacing: 0.15 },

  titleBlock: { alignItems: 'center', marginBottom: 26 },
  titleBlockMobile: { marginBottom: 22 },
  welcome: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '700' },
  welcomeMobile: { fontSize: 22 },
  appTitle: { color: COLORS.textPrimary, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, fontSize: 16, marginTop: 8, textAlign: 'center' },
  subtitleMobile: { fontSize: 14, marginTop: 6 },
  underline: { width: 120, height: 3, borderRadius: 2, marginTop: 14 },
  underlineMobile: { width: 94, marginTop: 10 },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionHeadingMobile: { marginBottom: 10 },
  practiceHeading: { marginTop: 6, marginBottom: 12 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  sectionTitleMobile: { fontSize: 16 },
  sectionSubtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },

  cardsRow: { flexDirection: 'row', alignItems: 'stretch', gap: 4, width: '100%' },
  cardsRowCompact: { gap: 16 },
  cardsRowStacked: { flexDirection: 'column', alignItems: 'stretch', gap: 20, width: '100%' },

  card: {
    flex: 1,
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    // @ts-ignore -- web-only, ignored on native
    transitionDuration: '160ms',
  },
  cardHovered: {
    transform: [{ translateY: -3 }],
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: COLORS.textPrimary, fontWeight: '700' },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, paddingRight: 36 },
  cardHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: COLORS.textPrimary, fontSize: 19, fontWeight: '700', flex: 1 },
  cardDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },

  factsBlock: { gap: 8, marginBottom: 18 },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  factIconWrap: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  factTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  factSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 },

  buttonWrap: {
    width: '100%',
    // @ts-ignore -- web-only
    transitionDuration: '120ms',
  },
  buttonHovered: {
    transform: [{ scale: 1.02 }],
    // @ts-ignore -- web-only
    cursor: 'pointer',
    opacity: 0.95,
  },
  buttonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },

  // Divider — the line is now a real flex child with a guaranteed minimum
  // height, not an absolutely-positioned element borrowing height from
  // its siblings, so it can no longer collapse to zero on remount.
  dividerContainer: {
    width: 40,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainerHorizontal: { width: '100%', minHeight: 40, flexDirection: 'row' },
  dividerLineVertical: { width: 2, flex: 1 },
  dividerLineHorizontal: { height: 2, flex: 1 },
  orBadge: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgMain,
    borderWidth: 2,
    borderColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 12 },

  practiceRow: { gap: 10, alignItems: 'stretch' },
  practiceRowMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  practiceButton: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    // @ts-ignore -- web-only, ignored on native
    transitionDuration: '140ms',
  },
  practiceButtonCompact: {
    width: '48%',
    maxWidth: '48%',
    minWidth: 0,
    flexBasis: '48%',
  },
  practiceButtonHovered: {
    transform: [{ translateY: -2 }],
    borderColor: 'rgba(255,255,255,0.3)',
  },
  practiceButtonPressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  practiceButtonSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 14,
  },
  practiceButtonSurfaceCompact: {
    minHeight: 46,
    paddingHorizontal: 10,
    gap: 8,
  },
  practiceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  practiceIconWrapCompact: {
    width: 28,
    height: 28,
    borderRadius: 9,
  },
  practiceButtonText: { flex: 1, color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  practiceButtonTextCompact: { fontSize: 12, lineHeight: 16 },
});