import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';
const bootstrap = async () => {
  await initMongoDB(); //підключаємось до бази даних
  setupServer(); //підключаємось до сервера
};
bootstrap();
