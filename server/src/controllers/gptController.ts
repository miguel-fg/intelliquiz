import { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import axios from "axios";
import {
  quizPrompt,
  validateJsonFormat,
  feedbackPrompt,
} from "../services/gptService";

const OPENAI_API_KEY = process.env.OPENAI_KEY;

// quiz generation
const quizController = async (c: Context) => {
  console.log("Generating quiz...");
  const { numQuestions, typeQuestions, textInput } = await c.req.json();
  const apiURI = "https://api.openai.com/v1/chat/completions";

  const prompt = quizPrompt(numQuestions, typeQuestions, textInput);

  const data = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const msgContent = response.data.choices[0].message.content;
    const quizData = validateJsonFormat(msgContent);
    if (!quizData.validJson) {
      throw new Error(quizData.error);
    }

    const parsed = quizData.quiz;

    const result = {
      id: uuidv4(),
      cover: {
        ...parsed.cover,
        numQuestions,
        typeQuestions,
      },
      questions: parsed.questions,
    };

    return c.json(result);
  } catch (error) {
    return c.json({ error: `Failed to generate quiz ERR:${error}` }, 500);
  }
};

// feedback generation
const feedbackController = async (c: Context) => {
  console.log("Generating feedback...");
  const { correct, wrong } = await c.req.json();
  const apiURI = "https://api.openai.com/v1/chat/completions";

  const prompt = feedbackPrompt(correct, wrong);

  const data = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const msgContent = response.data.choices[0].message.content;

    return c.text(msgContent);
  } catch (error) {
    return c.json({ error: "Failed to generate feedback" }, 500);
  }
};

export { quizController, feedbackController };
