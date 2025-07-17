import { JSONObject } from "hono/utils/types";

const jsonTemplates = {
  mcq: `{
  "questions": [
    {
      "question": "What is the capital city of Canada?",
      "type": "mcq",
      "options": ["Vancouver", "Ottawa", "Winnipeg", "Toronto"],
      "answer": "Ottawa",
      "hint": "This city sits on the border of Ontario and Quebec.",
      "explanation": "Ottawa is the capital of Canada, located in Ontario, near Quebec."
    }
  ]
}`,

  "t/f": `{
  "questions": [
    {
      "question": "Ottawa is the capital city of Canada.",
      "type": "t/f",
      "options": ["True", "False"],
      "answer": "True",
      "hint": "Canada's capital is located in the province of Ontario.",
      "explanation": "Ottawa is the official capital city of Canada."
    }
  ]
}`,

  open: `{
  "questions": [
    {
      "question": "Explain the significance of Ottawa as Canada's capital city.",
      "type": "open",
      "options": null,
      "answer": "Ottawa serves as Canada's political center, housing Parliament Hill and federal government institutions. Its location between Ontario and Quebec symbolizes national unity.",
      "hint": "Consider its political role and geographic positioning.",
      "explanation": null
    }
  ]
}`,

  mixed: `{
  "questions": [
    {
      "question": "What is the capital city of Canada?",
      "type": "mcq",
      "options": ["Vancouver", "Ottawa", "Winnipeg", "Toronto"],
      "answer": "Ottawa",
      "hint": "This city sits on the border of Ontario and Quebec.",
      "explanation": "Ottawa is the capital of Canada, located in Ontario, near Quebec."
    },
    {
      "question": "Ottawa is the capital city of Canada.",
      "type": "t/f",
      "options": ["True", "False"],
      "answer": "True",
      "hint": "Canada's capital is located in the province of Ontario.",
      "explanation": "Ottawa is the official capital city of Canada."
    }
  ]
}`,
};

const quizPrompt = (
  numQuestions: number,
  questionType: string,
  textInput: string,
) => {
  const template = jsonTemplates[questionType as keyof typeof jsonTemplates];

  if (!template) {
    throw new Error(`Unsupported question type: ${questionType}`);
  }

  const typeInstructions = {
    mcq: `Create ${numQuestions} multiple-choice questions. Each must have exactly 4 plausible options and only one correct answer. Do not include true or false questions.`,
    "t/f": `Create ${numQuestions} True/False questions. Use only ["True", "False"] as options. Capitalize the options.`,
    open: `Create ${numQuestions} open-ended questions that require short explanations. Set "options" to null.`,
    mixed: `Create ${numQuestions} questions using a mix of mcq, t/f, and open types.`,
  };

  const strictTypeConstraint =
    questionType !== "mixed"
      ? `Only generate questions of type "${questionType}". Do NOT include any other types.`
      : `Use a varied mix of question types.`;

  return `You are generating a quiz in JSON format based on the following input text:    

    "${textInput}"
    
    Requirements:
    - Number of questions: ${numQuestions}
    - Question type: ${questionType}
    - ${typeInstructions[questionType as keyof typeof typeInstructions]}
    - ${strictTypeConstraint}
    - Output valid JSON only, no additional text. It MUST be parseable as JSON.
    - Follow this exact structure:

    Structure:
    {
      "cover": {
        "title": "A clear, engaging quiz title. Do not use words like 'Quiz','Test', or similar",
        "description": "A 1-2 sentence overview of the quiz topic",
        "estTime": "Estimated time to complete, e.g. '5 minutes'"
      },
      "questions": [...]
    }

    Example question structure:
    ${template}

    Rules:
    - hints: max 15 words, subtle clues only
    - explanations: max 50 words, don't quote source text
    - mcq: 4 options, 1 correct
    - t/f: use ["True", "False"] for options
    - open: set options to null, provide sample answer
    - Vary difficulty levels across questions`;
};

const validateJsonFormat = (jsonString: string) => {
  try {
    return {
      validJson: true,
      quiz: JSON.parse(jsonString),
    };
  } catch (error: any) {
    return {
      validJson: false,
      error: `Invalid JSON format: ${error.message}`,
    };
  }
};

const feedbackPrompt = (
  wrongQuestions: Array<JSONObject>,
  rightQuestions: Array<JSONObject>,
) => {
  let wrongQuestionsText =
    wrongQuestions.length > 0
      ? `The user got the following questions wrong: ${wrongQuestions}.`
      : "";

  let rightQuestionsText =
    rightQuestions.length > 0
      ? `They answered these questions correctly: ${rightQuestions}.`
      : "";

  return `Based on the user's quiz attempts:
  
  ${wrongQuestionsText} ${rightQuestionsText}

  Please provide feedback on their performance in approximately 100 words. Highlight their strengths and areas for improvement.

  - Mention specific areas where they excelled and where they need to focus more.
  - Provide encouragement and positive reinforcement based on their performance.
  - Use the following grading criteria to guide your feedback without explicitly mentioning it:
    - Outstanding: 95% or higher
    - Excellent: 85% to 94%
    - Good: 75% to 84%
    - Average: 65% to 74%
    - Below Average: 50% to 64%
    - Work Hard: Below 50%

  Avoid directly referencing these criteria in your feedback, but ensure your comments reflect their performance level.
  `;
};

export { quizPrompt, validateJsonFormat, feedbackPrompt };
