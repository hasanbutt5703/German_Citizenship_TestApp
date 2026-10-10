// Quiz state: tracks session questions, answers, progress, mode, and completion actions.
import { create } from 'zustand';

type Answer = {
  questionId: string;
  selected: string;
  correct: boolean;
};

type QuizMode = 'practice' | 'exam';

type QuizState = {
  questions: any[];
  currentIndex: number;
  answers: Answer[];
  mode: QuizMode;
  startQuiz: (questions: any[], mode?: QuizMode) => void;
  submitAnswer: (selected: string) => void;
  nextQuestion: () => void;
  timeUp: () => void;
  isFinished: boolean;
  reset: () => void;
};

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answers: [],
  mode: 'practice',
  isFinished: false,

  startQuiz: (questions, mode = 'practice') =>
    set({ questions, currentIndex: 0, answers: [], isFinished: false, mode }),

  submitAnswer: (selected) => {
    const { questions, currentIndex, answers } = get();
    const current = questions[currentIndex];
    if (!current || answers.some((answer) => answer.questionId === current.id)) return;
    const correct = selected === current.correctAnswer;
    set({ answers: [...answers, { questionId: current.id, selected, correct }] });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex + 1 >= questions.length) {
      set({ isFinished: true });
    } else {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  // Called when the exam-mode countdown hits zero — ends the quiz immediately,
  // grading whatever was answered so far (unanswered questions simply count as wrong).
  timeUp: () => set({ isFinished: true }),

  reset: () => set({ questions: [], currentIndex: 0, answers: [], isFinished: false }),
}));