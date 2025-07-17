export type QuestionType = "mcq" | "t/f" | "open";

export interface BaseQuestion {
  question: string;
  type: QuestionType;
  hint: string;
  explanation: string | null;
  answer: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: [string, string, string, string];
}

export interface TFQuestion extends BaseQuestion {
  type: "t/f";
  options: ["true", "false"];
}

export interface OpenQuestion extends BaseQuestion {
  type: "open";
  options: null;
}

export type QuizQuestion = MCQQuestion | TFQuestion | OpenQuestion;

export interface QuizJsonResponse {
  questions: QuizQuestion[];
}

export type QuizState = QuizQuestion[] | "loading" | "error";
