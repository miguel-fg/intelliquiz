import { Hono } from "hono";
import { authController, extractController, createController } from "../controllers/pdfController";

const pdfRoutes = new Hono();

//POST access token
pdfRoutes.get('/auth', authController);

//POST presigned URI
pdfRoutes.post('/extract', extractController);

//POST extract text

export default pdfRoutes;