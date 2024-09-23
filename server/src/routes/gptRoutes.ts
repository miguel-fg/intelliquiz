import { Hono } from 'hono';
import {
  quizController,
  feedbackController,
} from '../controllers/gptController';

const gptRoutes = new Hono();

// POST quiz
gptRoutes.post('/quiz', quizController);

// POST feedback
gptRoutes.post('/feedback', feedbackController);

export default gptRoutes;
