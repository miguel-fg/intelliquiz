import { Context } from 'hono';
import 'dotenv/config';
import axios from 'axios';
import { quizPrompt, validateJsonFormat, feedbackPrompt } from '../services/gptService';

const OPENAI_API_KEY = process.env.OPENAI_KEY;

// quiz generation
const quizController = async (c: Context) => {
  const { numQuestions, questionType, textInput } = await c.req.json();
  const apiURI = 'https://api.openai.com/v1/chat/completions';

  const prompt = quizPrompt(numQuestions, questionType, textInput);

  const data = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const msgContent = response.data.choices[0].message.content;
    const quizData = validateJsonFormat(msgContent);
    if(!quizData.validJson) {
      throw new Error(quizData.error);
    }

    return c.json(quizData);
  } catch (error) {
    return c.json({ error: `Failed to generate quiz ERR:${error}` }, 500);
  }
};

// feedback generation
const feedbackController = async (c: Context) => {
  const { wrongQuestions, rightQuestions } = await c.req.json();
  const apiURI = 'https://api.openai.com/v1/chat/completions';

  const prompt = feedbackPrompt(wrongQuestions, rightQuestions);

  const data = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const msgContent = response.data.choices[0].message.content;

    return c.text(msgContent);
  } catch (error) {
    return c.json({ error: 'Failed to generate feedback' }, 500);
  }
};

export { quizController, feedbackController };
