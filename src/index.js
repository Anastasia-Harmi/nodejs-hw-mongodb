import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/usersConstants.js';

const bootstrap = async () => {
  await initMongoDB(); //підключаємось до бази даних
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer(); //підключаємось до сервера
};
bootstrap();
