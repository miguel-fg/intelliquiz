import { JSONObject } from "hono/utils/types";

const jsonTemplate = `
{
  "questions": [
    {
      "question": "What is the capital city of Canada?",
      "options": ["Vancouver", "Ottawa", "Winnipeg", "Toronto"],
      "answer": "Ottawa",
      "hint": "This city sits on the border of Ontario and Quebec.",
      "explanation": "Ottawa is the capital of Canada, located in Ontario, near Quebec."
    },
    {
      "question": "Ottawa is the capital city of Canada.",
      "options": ["true", "false"],
      "answer": "true",
      "hint": "Canada's capital is located in the province of Ontario.",
      "explanation": "Ottawa is the official capital city of Canada."
    }
  ]
}`;

const quizPrompt = (
  numQuestions: number,
  questionType: string,
  textInput: string
) => {
  return `Generate ${numQuestions} quiz questions of type '${questionType}' based on the following text: '${textInput}'.
  The response must be in valid JSON format. Ensure the JSON structure matches the following example:
  ${jsonTemplate}.
  
  IMPORTANT:
  - Do not include any line breaks, escape characters (e.g., "\\n"), or additional text in the response.
  - Replace single quotes with double quotes in the JSON object.
  - Each question must have a "hint" field, giving a subtle clue (max 15 words).
  - Provide an "explanation" field for each question (max 50 words), ensuring that the explanation does not directly reference the input text.

  Ensure that the output can be parsed directly as valid JSON.`;
};

const validateJsonFormat = (jsonString: string) => {
  try {
    return {
      validJson: true,
      quiz: JSON.parse(jsonString)
    };
  } catch (error: any) {
    return {
      validJson: false,
      error: `Invalid JSON format: ${error.message}`
    }
  }
}

const feedbackPrompt = (wrongQuestions: Array<JSONObject>, rightQuestions: Array<JSONObject>) => {
  let wrongQuestionsText =
    wrongQuestions.length > 0
      ? `The user got the following questions wrong: ${wrongQuestions}.`
      : '';

  let rightQuestionsText =
    rightQuestions.length > 0
      ? `They answered these questions correctly: ${rightQuestions}.`
      : '';

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
