import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
// import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
// dotenv.config(); //читає текстовий файл з env і записує в налаштування комп.
import * as contactsServices from "./services/contactsServices.js";

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

  app.get('/contacts', async (req, res) => {
    const data = await contactsServices.getContacts();
    res.json({
      status: 200,
      messsage: "Successfully found movies",
      data
    });
  });

app.get("/contacts/:id", async (req, res)=>{
  const {id} = req.params;
  const data = await contactsServices.getContactById(id);

  if (!data) {
    return res.status(404).json({
      status: 404,
      message: `Movie with id=${id} not found`,
    });
  }

  res.json({
    status: 200,
    message: `Successfully find movie with id=${id}`,
    data,
  });
});

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
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
