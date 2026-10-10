import { LanguageQuestion, Difficulty } from '@/constants/languageQuestions';
import { KnowledgeQuestion, Topic } from '@/constants/knowledgeQuestions';


// Quiz builders: select and randomize questions for DTZ and citizenship sessions.

export function buildDtzMockSession(bank: LanguageQuestion[], totalQuestions: number): LanguageQuestion[] {
  // The local language bank currently contains l1... IDs, not dtz1...dtz45.
  // Use those questions for the mock DTZ session instead of filtering the
  // bank down to an empty array.
  return shuffleArray(bank).slice(0, totalQuestions).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

type TopicMix = Record<Topic, number>;

export function buildKnowledgeQuizSession(
  bank: KnowledgeQuestion[],
  totalQuestions: number,
  mix: TopicMix
): KnowledgeQuestion[] {
  const byTopic: Record<Topic, KnowledgeQuestion[]> = {
    politics: shuffleArray(bank.filter((q) => q.topic === 'politics')),
    history: shuffleArray(bank.filter((q) => q.topic === 'history')),
    society: shuffleArray(bank.filter((q) => q.topic === 'society')),
  };

  const selected: KnowledgeQuestion[] = [];

  (Object.keys(mix) as Topic[]).forEach((topic) => {
    const count = Math.round(totalQuestions * mix[topic]);
    selected.push(...byTopic[topic].slice(0, count));
  });

  if (selected.length < totalQuestions) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remaining = shuffleArray(bank.filter((q) => !usedIds.has(q.id)));
    selected.push(...remaining.slice(0, totalQuestions - selected.length));
  }

  const withShuffledOptions = selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));

  return shuffleArray(withShuffledOptions).slice(0, totalQuestions);
}

// Fisher-Yates shuffle — standard, unbiased way to randomize an array in place.
function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
}
    return result;
}

type DifficultyMix = Record<Difficulty, number>;

// Default: roughly 40% easy, 40% medium, 20% hard — feels fair to a learner,
// not too easy, not too punishing. Tweak these ratios anytime.
const DEFAULT_MIX: DifficultyMix = {
    easy: 0.4,
    medium: 0.4,
    hard: 0.2,
};

/**
 * Builds a randomized quiz session:
 * 1. Groups the question bank by difficulty
 * 2. Shuffles each group independently
 * 3. Picks a proportional slice from each group based on the mix ratios
 * 4. Shuffles the final combined set so difficulty order isn't predictable
 * 5. Also shuffles each question's own answer options
 */
export function buildQuizSession(
    bank: LanguageQuestion[],
    totalQuestions: number,
    mix: DifficultyMix = DEFAULT_MIX
): LanguageQuestion[] {
const byDifficulty: Record<Difficulty, LanguageQuestion[]> = {
    easy: shuffleArray(bank.filter((q) => q.difficulty === 'easy')),
    medium: shuffleArray(bank.filter((q) => q.difficulty === 'medium')),
    hard: shuffleArray(bank.filter((q) => q.difficulty === 'hard')),
};

const selected: LanguageQuestion[] = [];

(Object.keys(mix) as Difficulty[]).forEach((level) => {
    const count = Math.round(totalQuestions * mix[level]);
    selected.push(...byDifficulty[level].slice(0, count));
});

  // If rounding left us short (small question banks), top up from whatever remains
if (selected.length < totalQuestions) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remaining = shuffleArray(bank.filter((q) => !usedIds.has(q.id)));
    selected.push(...remaining.slice(0, totalQuestions - selected.length));
}

  // Shuffle answer options per question, so the correct answer isn't always in the same position
const withShuffledOptions = selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
}));

    return shuffleArray(withShuffledOptions).slice(0, totalQuestions);
}