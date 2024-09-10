import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import gptRoutes from './routes/gptRoutes';
import pdfRoutes from './routes/pdfRoutes';

const app = new Hono();
app.use(logger());
app.use('/*', cors());

// OPEN AI API requests
app.route('/gpt', gptRoutes);

// Adobe PDF Services API requests
app.route('/pdf', pdfRoutes);

const port = 3000;
console.log(`Intelliquiz server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
