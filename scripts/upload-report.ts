import fs from 'fs';
import path from 'path';
import { uploadFile } from 'uploadcare/upload-client';

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
    const result = await uploadFile(reportFile, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      store: 'auto',
      metadata: {
        subsystem: 'uploader',
        test_run: 'true'
      }
    });

    console.log(`Test report uploaded successfully. URL: ${result.originalUrl}`);
  } catch (error) {
    console.error('Error uploading test report:', error);
    process.exit(1);
  }
}

uploadReport();