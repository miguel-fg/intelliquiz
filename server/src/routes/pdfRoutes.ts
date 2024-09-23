import { Hono } from "hono";
import { authController, extractController, generateController } from "../controllers/pdfController";

const pdfRoutes = new Hono();

//POST access token
pdfRoutes.get('/auth', authController);

//POST extract text
pdfRoutes.post('/extract', extractController);

//POST generate PDF
pdfRoutes.post('/generate', generateController);

export default pdfRoutes;