import { createContext, useState, ReactNode, useContext } from "react";
import { QuizQuestion, QuizState } from "../types/quiz";

interface QuizContextType {
  quiz: QuizState;
  setQuiz: React.Dispatch<React.SetStateAction<QuizState>>;
}

export const QuizContext = createContext<QuizContextType | null>(null);

interface ContextProps {
  defaultQuiz?: QuizQuestion[];
  children: ReactNode;
}

const QuizContextProvider = ({ defaultQuiz = [], children }: ContextProps) => {
  const [quiz, setQuiz] = useState<QuizState>(defaultQuiz);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used inside a QuizContextProvider");
  }

  return context;
};

export default QuizContextProvider;
