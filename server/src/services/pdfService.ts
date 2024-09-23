import axios from 'axios';
import { JSONArray, JSONObject } from 'hono/utils/types';
import jsZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

const PDF_CLIENT_ID = process.env.PDF_CLIENT_ID;

/** GENERAL PURPOSE FUNCTIONS */

/**
 * Generates a preauthorized link to an AWS S3 Bucket to upload files and perform operations on. The URI cannot be reused.
 * @param token Adobe PDF Services access token.
 * @param type  String ['pdf' || 'docx'] defines the type of file to send.
 * @returns A link to send the document to and a unique identifier for the asset.
 */
const generatePresignedURI = async (token: string, type: string) => {
  console.log('Generating presigned URI...');
  const apiURI = 'https://pdf-services-ue1.adobe.io/assets';

  const mediaType =
    type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const data = {
    mediaType: mediaType,
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        Authorization: token,
        'x-api-key': PDF_CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to generate presigned URI. ERR: ${error}`);
  }
};

const uploadFile = async (
  file: File | Buffer,
  uploadURI: string,
  type: string
) => {
  console.log('Uploading file...');
  const contentType =
    type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  let fileData: Buffer;

  if (file instanceof Buffer) {
    fileData = file;
  } else {
    fileData = Buffer.from(await file.arrayBuffer());
  }

  try {
    const response = await axios.put(uploadURI, fileData, {
      headers: {
        'Content-Type': contentType,
      },
    });

    if (response.status === 200) {
      return response.status;
    } else {
      throw new Error(`Response with status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to upload file. ERR: ${error}`);
  }
};

/** TEXT EXTRACTION FUNCTIONS */

const startExtractJob = async (token: string, assetID: string) => {
  console.log('Starting text extraction...');
  const apiURI = 'https://pdf-services-ue1.adobe.io/operation/extractpdf';

  const data = {
    assetID: assetID,
    elementsToExtract: ['text'],
  };

  try {
    const response = await axios.post(apiURI, data, {
      headers: {
        Authorization: token,
        'x-api-key': PDF_CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });

    console.log('Polling for job completion...');
    let jobStatus;
    let result;
    do {
      result = await axios.get(response.headers.location, {
        headers: {
          Authorization: token,
          'x-api-key': PDF_CLIENT_ID,
        },
      });

      jobStatus = result.data.status;
      console.log('Job status: ', jobStatus);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (jobStatus !== 'done' && jobStatus !== 'failed');

    if (jobStatus === 'done') {
      return result.data.resource.downloadUri;
    } else if (jobStatus === 'failed') {
      throw new Error();
    }
  } catch (error) {
    throw new Error(`Failed to extract text. ERR: ${error}`);
  }
};

const downloadDocText = async (downloadURI: string) => {
  console.log('Downloading text...');

  try {
    const response = await axios.get(downloadURI, {
      responseType: 'arraybuffer',
    });

    const zip = await jsZip.loadAsync(response.data);

    const fileName = Object.keys(zip.files)[0];
    const file = zip.files[fileName];

    const fileContent = await file.async('text');
    const jsonData = JSON.parse(fileContent);
    const elements = jsonData.elements;

    let extractedText = '';

    elements.forEach((element: any) => {
      extractedText += element.Text;
    });

    return extractedText;
  } catch (error) {
    throw new Error(`Failed to download document text ${error}`);
  }
};

/** GENERATE PDF FUNCTIONS */

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
}

const quizDataBuilder = async (quiz: QuizQuestion[]) => {
  console.log('Building quiz data...');
    const convertOptionsToObject = (options: string[]) => {
    const optionsObject: {[key: string]: string} = {};

    options.forEach((option, index) => {
      optionsObject[String.fromCharCode(97 + index)] = option;
    });

    return optionsObject;
  };

  const quizData = {
    questions: quiz.map((question) => ({
      ...question,
      options: convertOptionsToObject(question.options),
    })),
  };

  return quizData;
}

const retrieveDocxTemplate = async (templateID: string) => {
  console.log('Retrieving docx template...');
  const templateDir = path.join(__dirname, '../templates/');

  let templateFilename = '';

  switch (templateID) {
    case 'mcq-wa':
      templateFilename = 'quiz-mcq-wa-template.docx';
      break;
    case 'mcq-na':
      templateFilename = 'quiz-mcq-na-template.docx';
      break;
    case 'tf-wa':
      templateFilename = 'quiz-tf-wa-template.docx';
      break;
    case 'tf-na':
      templateFilename = 'quiz-tf-na-template.docx';
      break;
    case 'report':
      templateFilename = 'report-template.docx';
      break;
    default:
      throw new Error('Invalid template ID');
  }

  const templatePath = path.join(templateDir, templateFilename);

  try {
    const fileBuffer = await fs.readFile(templatePath);
    return fileBuffer;
  } catch (error) {
    console.log('Something went wrong :(');
    throw new Error(`Failed to retrieve .DOCX template. ERR: ${error}`);
  }
};

const startGenerationJob = async (
  token: string,
  assetID: string,
  jsonData: JSONObject
) => {
  console.log('Generating PDF document...');
  const apiURI =
    'https://pdf-services-ue1.adobe.io/operation/documentgeneration';
  
  const data = {
    assetID: assetID,
    outputFormat: 'pdf',
    jsonDataForMerge: jsonData
  };

  try {
    const response = await axios.post(apiURI, data, {
        headers: {
            Authorization: token,
            'x-api-key': PDF_CLIENT_ID,
            'Content-Type': 'application/json'
        }
    });

    console.log('Polling for job completion...');
    let jobStatus;
    let result;
    do {
      result = await axios.get(response.headers.location, {
        headers: {
          Authorization: token,
          'x-api-key': PDF_CLIENT_ID,
        },
      });

      jobStatus = result.data.status;
      console.log('Job status: ', jobStatus);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (jobStatus !== 'done' && jobStatus !== 'failed');

    if (jobStatus === 'done') {
      return result.data.asset.downloadUri;
    } else if (jobStatus === 'failed') {
      throw new Error(`Code: ${result.data.error.code}. Message: ${result.data.error.message}`);
    }

  } catch (error) {
    throw new Error(`Failed to generate document. ${error}`);
  }
};

const encryptPDF = async (
  token: string,
  downloadURI: string,
  pwd: string
) => {
  console.log('Encrypting PDF...')
  const apiURI = 'https://pdf-services-ue1.adobe.io/operation/protectpdf';

  try {
    const response = await axios.get(downloadURI, {
      responseType: 'arraybuffer'
    });

    const pdfFile = Buffer.from(response.data);

    const { uploadUri, assetID } = await generatePresignedURI(token, 'pdf');
    const uploadSuccessful = await uploadFile(pdfFile, uploadUri, 'pdf');

    if(uploadSuccessful) {
      const data = {
        assetID: assetID,
        passwordProtection: {
          userPassword: pwd
        },
        encryptionAlgorithm: 'AES_256'
      };

      const response = await axios.post(apiURI, data, {
        headers: {
          Authorization: token,
          'x-api-key': PDF_CLIENT_ID,
          'Content-Type': 'application/json'
        }
      });

      console.log('Polling for job completion...');
      let jobStatus;
      let result;
      do {
        result = await axios.get(response.headers.location, {
          headers: {
            Authorization: token,
            'x-api-key': PDF_CLIENT_ID,
          },
        });

        jobStatus = result.data.status;
        console.log('Job status: ', jobStatus);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } while (jobStatus !== 'done' && jobStatus !== 'failed');

      if (jobStatus === 'done') {
        return result.data.asset.downloadUri;
      } else if (jobStatus === 'failed') {
        throw new Error(
          `Code: ${result.data.error.code}. Message: ${result.data.error.message}`
        );
      }
    }
  } catch (error) {
    throw new Error(`Error encrypting PDF. ${error}`);
  }
};

export {
  generatePresignedURI,
  uploadFile,
  startExtractJob,
  downloadDocText,
  quizDataBuilder,
  retrieveDocxTemplate,
  startGenerationJob,
  encryptPDF
};
