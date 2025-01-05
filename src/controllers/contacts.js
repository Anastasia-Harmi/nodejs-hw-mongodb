import * as contactsServices from '../services/contactsServices.js';
import createHttpError from 'http-errors';

export const getContactsContrller = async (req, res) => {
  const data = await contactsServices.getContacts();
  res.json({
    status: 200,
    messsage: 'Successfully found movies',
    data,
  });
};

export const getContactsByIdContrller = async (req, res) => {
  const { id } = req.params;
  const data = await contactsServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Movie with id ${id} not found`);
    // const error = new Error(`Movie with id ${id} not found`); //створюємо помилку
    // error.status = 404; //якщо нема фільму з цим id-відправляється 404помилка на фронтенд, додаємо самі,бо в {}new Error нема поля статус
    // throw error; //помилка перейде до обгортки і там обробиться
  }

  res.json({
    status: 200,
    message: `Successfully find movie with id=${id}`,
    data,
  }); //обробка вдалого запиту в цій функції відбудеться
};

export const addContactContrller = async (req, res) => {
  const data = contactsServices.addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactContrller = async (req, res) => {
  const { id } = req.params; //беремо id
  const { isNew, data } = await contactsServices.updateContact(id, req.body, {
    upsert: true,
  });
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'successfullyy upsert contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params; //беремо id
  const result = await contactsServices.updateContact(id, req.body);

  if (!result) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }
  res.json({
    status: 200,
    message: 'successfullyy upsert contact',
    data: result.data,
  });
};
