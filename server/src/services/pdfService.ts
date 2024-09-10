import axios from 'axios';
import jsZip from 'jszip';

const PDF_CLIENT_ID = process.env.PDF_CLIENT_ID;

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

const uploadFile = async (file: File, uploadURI: string, type: string) => {
  console.log('Uploading file...');
  const contentType =
    type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    const response = await axios.put(uploadURI, fileBuffer, {
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

export { generatePresignedURI, uploadFile, startExtractJob, downloadDocText };
