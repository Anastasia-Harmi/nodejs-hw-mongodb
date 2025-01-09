// import express from "express";

import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactAddSchema } from '../constants/contactsConstans.js';
import { validateBody } from '../validation/contacts.js';

const contactsRouter = Router();

// contactsRouter.get('/', (req, res) => {
//   res.json({
//     message: 'Start work',
//   });
// });

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsContrller)); // після коми вказуємо назву функції-обробника, яка розписана в routers

contactsRouter.get(
  '/:id',
  ctrlWrapper(contactsController.getContactsByIdContrller),
);

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.addContactContrller),
);

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactsController.upsertContactContrller),
); // upsert(якщо є id-додати, нема-створити)
export default contactsRouter;

contactsRouter.patch(
  '/:id',
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.patchContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactsController.deleteContactController),
);
