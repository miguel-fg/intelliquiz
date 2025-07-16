import axios from 'axios';

export const downloadPDF = async (downloadURI) => {
  console.log('Downloading document...');
  try {
    const response = await axios.get(downloadURI, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'quiz.pdf');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Failed to download document ${error}`);
  }
};
