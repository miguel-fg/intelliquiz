import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import gptRoutes from './routes/gptRoutes';

const app = new Hono();
app.use(logger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// OPEN AI API requests
app.route('/gpt', gptRoutes);

const port = 3000;
console.log(`Intelliquiz server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
