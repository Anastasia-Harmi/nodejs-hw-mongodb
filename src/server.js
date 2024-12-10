import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

export const startServer = () => {
  const app = express();
  //створюємо мідлвари:
  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // app.use((req, res, next) => {
  //   console.log();
  //   next(); //щоб пішов далі, так як шлях 1 аргум відсутній, то для всих підійде і тут зупиниться
  // });

  app.get('/', (req, res) => {
    res.json({
      message: 'Start work',
    });
  });

  // app.get('/contacts', (req, res) => {
  //   res.json(contacts);
  // });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });
  app.use((error, req, res, next) => {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  });
  //запускаємо сервер:
  // const port = Number(getEnvVar('PORT', 3000));
  app.listen(3000, () => console.log(`Server running on ? port`));
};
