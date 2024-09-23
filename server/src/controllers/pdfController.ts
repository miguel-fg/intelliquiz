import { Context } from 'hono';
import 'dotenv/config';
import axios from 'axios';

import {
  generatePresignedURI,
  uploadFile,
  startExtractJob,
  downloadDocText,
  quizDataBuilder,
  retrieveDocxTemplate,
  startGenerationJob,
  encryptPDF
} from '../services/pdfService';

const PDF_CLIENT_ID = process.env.PDF_CLIENT_ID;
const PDF_CLIENT_SECRET = process.env.PDF_CLIENT_SECRET;

const authController = async (c: Context) => {
  const apiURI = 'https://pdf-services-ue1.adobe.io/token';

  const data = {
    client_id: PDF_CLIENT_ID,
    client_secret: PDF_CLIENT_SECRET,
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return c.json(response.data);
  } catch (error) {
    console.log('Failed to generate access token. ERR: ', error);
  }
};

const extractController = async (c: Context) => {
  const body = await c.req.parseBody();
  const token = body['token'] as string;
  const file = body['file'] as File;

  const FILETYPE = 'pdf';
  if (token && file) {
    const { uploadUri, assetID } = await generatePresignedURI(token, FILETYPE);

    const uploadSuccessful = await uploadFile(file, uploadUri, FILETYPE);

    if (uploadSuccessful) {
      const downloadUri = await startExtractJob(token, assetID);
      const docText = await downloadDocText(downloadUri);
      return c.json({ text: docText });
    }

    return c.json({ error: 'Failed to extract text.' });
  } else {
    return c.json({ error: 'Failed to extract text.' });
  }
};

const generateController = async (c: Context) => {
  const { token, quizData, templateID, pwd, report } = await c.req.json();
  const FILETYPE = 'docx';

  const template = await retrieveDocxTemplate(templateID);
  
  const jsonData = report ? quizData : await quizDataBuilder(quizData);
  
  if(token && template){
      const { uploadUri, assetID } = await generatePresignedURI(token, FILETYPE);

      const uploadSuccessful = await uploadFile(template, uploadUri, FILETYPE);

      if(uploadSuccessful){
        const downloadUri = await startGenerationJob(token, assetID, jsonData);

        if(pwd) {
          const encryptedPDFUri = await encryptPDF(token, downloadUri, pwd);
          return c.json({encryptedPDFUri});
        } else {
          return c.json({downloadUri});
        }
      } else {
        return c.json({error: 'Failed to upload the template.'})
      }
  } else {
    return c.json({error: 'Invalid token or template'});
  }
};

export { authController, extractController, generateController };
