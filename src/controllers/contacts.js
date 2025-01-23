import * as contactsServices from '../services/contactsServices.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsPaginationParams.js';
import { sortByList } from '../db/models/Contact.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsContrller = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query); //req.query містить дані запиту з url після ?
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id; //повертаємо лише фільми залогіненого юзера

  const contacts = await contactsServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });
  res.json({
    status: 200,
    messsage: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactsByIdContrller = async (req, res) => {
  console.log(req.params);
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const data = await contactsServices.getContactById({ _id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id ${_id} not found`);
    // const error = new Error(`Movie with id ${id} not found`); //створюємо помилку
    // error.status = 404; //якщо нема фільму з цим id-відправляється 404помилка на фронтенд, додаємо самі,бо в {}new Error нема поля статус
    // throw error; //помилка перейде до обгортки і там обробиться
  }

  res.json({
    status: 200,
    message: `Successfully find movie with id=${_id}`,
    data,
  }); //обробка вдалого запиту в цій функції відбудеться
};

export const addContactContrller = async (req, res) => {
  const { _id: userId } = req.user;
  const newContact = await contactsServices.addContact({ ...req.body, userId }); // req.body -це тіло запиту
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const upsertContactContrller = async (req, res) => {
  const { id } = req.params; //беремо id
  const { _id: userId } = req.user;
  const { isNew, data } = await contactsServices.updateContact(
    id,
    { ...req.body, userId },
    {
      upsert: true,
    },
  );
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'successfullyy upsert contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params; //беремо id
  const { _id: userId } = req.user;

  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const result = await contactsServices.updateContact(
    { _id, userId },
    { ...req.body, photo: photoUrl },
  );

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactsServices.deleteContact({ _id, userId }); //або відразу req.params.id

  if (!data) {
    throw createHttpError(404, `Contact with id = ${_id} not found`); // оператор throw відповідає за те,щоб помилка прокинулась в catch,який у декораторі в ctrlWrapper єб throw сам перериває функцію, якби тут був next,return треба було б писати
  }
  res.status(204).send();
};
