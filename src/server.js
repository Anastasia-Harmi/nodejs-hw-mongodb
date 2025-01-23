import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
// dotenv.config(); //читає текстовий файл з env і записує в налаштування комп.
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/usersConstants.js';

export const setupServer = () => {
  const app = express();

  //створюємо мідлвари:
  app.use(cors());
  app.use(express.json());
  app.use(logger);
  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/auth', authRouter); //запит, що почин з /auth шукаємо його обробку в об'єкті authRouter в routers;

  app.use('/contacts', contactsRouter); //якщо прийде любий запит, що починається з /contacts,то обробку його шукай у об'єкті contactsRouter
  // app.use((req, res, next) => {
  //   console.log();
  //   next(); //щоб пішов далі, так як шлях 1 аргум відсутній, то для всих підійде і тут зупиниться
  // });

  //мідлвара обробляє запити, яких не має, не знайдено
  app.use(notFoundHandler);

  //мідлвара оброблятиме помилку
  app.use(errorHandler);

  //   res.status(500).json({
  //     message: 'Server error',
  //     error: error.message,
  //   });
  // });

  //запускаємо сервер:
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
