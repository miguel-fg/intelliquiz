import { QuizJsonResponse } from "../types/quiz";

const sampleQuiz: QuizJsonResponse = {
  id: "c9780207-c0df-45a2-82ad-680ba95624d6",
  cover: {
    title: "DNA and Genetic Fundamentals",
    description:
      "Test your knowledge on DNA structure, replication, and gene expression.",
    estTime: "5 minutes",
    numQuestions: 5,
    typeQuestions: "mixed",
  },
  questions: [
    {
      question: "What is the shape of the DNA molecule?",
      type: "mcq",
      options: [
        "Single helix",
        "Double helix",
        "Triple helix",
        "Circular helix",
      ],
      answer: "Double helix",
      hint: "Think of a twisted ladder.",
      explanation:
        "DNA is structured as a double helix, resembling a twisted ladder with nucleotide pairs as the rungs.",
    },
    {
      question: "Uracil is found in DNA instead of thymine.",
      type: "t/f",
      options: ["True", "False"],
      answer: "False",
      hint: "Which molecule contains uracil?",
      explanation:
        "Uracil is found in RNA, while DNA contains thymine along with adenine, cytosine, and guanine.",
    },
    {
      question: "Describe the process of DNA replication in your own words.",
      type: "open",
      options: null,
      answer:
        "DNA replication involves unwinding the double helix, separating the two strands, and using each strand as a template to synthesize a new complementary strand, resulting in two identical DNA molecules.",
      hint: "Think about how the strands separate and new strands are formed.",
      explanation: null,
    },
    {
      question: "Which enzyme is primarily responsible for DNA replication?",
      type: "mcq",
      options: ["RNA polymerase", "DNA ligase", "DNA polymerase", "Helicase"],
      answer: "DNA polymerase",
      hint: "This enzyme adds nucleotides to the growing DNA strand.",
      explanation:
        "DNA polymerase is the main enzyme that synthesizes new DNA strands by adding nucleotides complementary to the template strand.",
    },
    {
      question: "All mutations are harmful to organisms.",
      type: "t/f",
      options: ["True", "False"],
      answer: "False",
      hint: "Consider how some variations might be beneficial.",
      explanation:
        "While some mutations can be harmful, others can be neutral or even beneficial, providing genetic diversity that drives evolution.",
    },
  ],
};

export default sampleQuiz;
