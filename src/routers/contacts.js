// import express from "express";

import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/autheticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate); //спершу запит пройде через перевірку authenticate,а вже потім в маршрути

// contactsRouter.get('/', (req, res) => {
//   res.json({
//     message: 'Start work',
//   });
// });

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsContrller)); // після коми вказуємо назву функції-обробника, яка розписана в routers

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.getContactsByIdContrller),
);

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.addContactContrller),
);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.upsertContactContrller),
); // upsert(якщо є id-додати, нема-створити)
export default contactsRouter;

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.patchContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.deleteContactController),
);
