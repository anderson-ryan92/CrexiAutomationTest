import uploadcare from 'uploadcare';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_PRIVATE_KEY = process.env.UPLOADCARE_PRIVATE_KEY;

if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_PRIVATE_KEY) {
  console.error('UPLOADCARE_PUBLIC_KEY or UPLOADCARE_PRIVATE_KEY is not set');
  process.exit(1);
}

const client = uploadcare(UPLOADCARE_PUBLIC_KEY, UPLOADCARE_PRIVATE_KEY);

// Promisify the uploadcare file upload method
const uploadFile = promisify(client.file.upload);

async function uploadReport() {
  const reportDir = path.join(process.cwd(), 'playwright-report');
  const reportFile = path.join(reportDir, 'index.html');

  if (!fs.existsSync(reportFile)) {
    console.error('Test report file not found');
    process.exit(1);
  }

  try {
    const result = await uploadFile(fs.createReadStream(reportFile), {
      store: true
    });

    if (typeof result === 'object' && 'file' in result) {
      console.log(`Test report uploaded successfully. File ID: ${result.file}`);
    } else {
      console.error('Unexpected result format from uploadFile');
    }
  } catch (error) {
    console.error('Error uploading test report:', error);
    process.exit(1);
  }
}

uploadReport();