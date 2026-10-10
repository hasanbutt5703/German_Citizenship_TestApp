// Exam setup: centralizes test lengths, time limits, pass marks, and topic weights.
// Real DTZ (Deutsch-Test für Zuwanderer) Modellsatz format — confirmed against
// the official Goethe-Institut/telc exam booklet.
export const DTZ_EXAM = {
  totalQuestions: 45,       // 20 Hören + 25 Lesen — matches dtz1..dtz45 exactly
  timeLimitMinutes: 70,     // official combined time for Hören + Lesen incl. marking answers
  passCountA2: 20,          // 20/45 correct → A2 level
  passCountB1: 33,          // 33/45 correct → B1 level
  get passPercentageA2() {
    return (this.passCountA2 / this.totalQuestions) * 100;
  },
  get passPercentageB1() {
    return (this.passCountB1 / this.totalQuestions) * 100;
  },
};


// Real Einbürgerungstest format, confirmed against official sources.
export const KNOWLEDGE_EXAM = {
  totalQuestions: 33,      // 30 general + 3 state-specific on the real test (state-specific not yet implemented)
  timeLimitMinutes: 60,
  passCount: 17,           // out of 33 on the real test
  get passPercentage() {
    return (this.passCount / this.totalQuestions) * 100; // ~51.5% — used so pass/fail scales correctly even with a smaller question bank
  },
};

export const KNOWLEDGE_PRACTICE = {
  totalQuestions: 10,       // shorter session for casual practice mode
};

// Real DTZ topic weighting, approximated from the official catalog's distribution
export const KNOWLEDGE_TOPIC_MIX = {
  politics: 0.55,
  history: 0.23,
  society: 0.22,
};