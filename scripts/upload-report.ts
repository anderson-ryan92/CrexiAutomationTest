import { uploadFile } from '@uploadcare/upload-client';
import fs from 'fs';
import path from 'path';

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;

if (!UPLOADCARE_PUBLIC_KEY) {
  console.error('UPLOADCARE_PUBLIC_KEY is not set');
  process.exit(1);
}

async function uploadReport() {
  const reportDir = path.join(process.cwd(), 'playwright-report');
  const reportFile = path.join(reportDir, 'index.html');

  if (!fs.existsSync(reportFile)) {
    console.error('Test report file not found');
    process.exit(1);
  }

  try {
    // Read the file into a Buffer
    const fileBuffer = fs.readFileSync(reportFile);

    const result = await uploadFile(fileBuffer, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      store: 'auto',
      fileName: 'playwright-report.html'
    });

    if ('uuid' in result) {
      console.log(`Test report uploaded successfully. File ID: ${result.uuid}`);
      console.log(`File URL: https://ucarecdn.com/${result.uuid}/`);
    } else {
      console.error('Unexpected result format from uploadFile');
    }
  } catch (error) {
    console.error('Error uploading test report:', error);
    process.exit(1);
  }
}

uploadReport().catch(error => {
  console.error('Unhandled error in uploadReport:', error);
  process.exit(1);
});