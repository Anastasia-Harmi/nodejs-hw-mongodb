import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10 }) => {
  const limit = perPage;
  const skip = (page - 1) * limit; //скільки пропустити {} з початку колекції
  const items = await ContactCollection.find().skip(skip).limit(limit);
  const total = await ContactCollection.countDocuments(); //рахує скільки всього {}у колекції і повертає число
  const paginationData = calcPaginationData({ total, page, perPage });

  // throw new Error("Database error");
  return {items,
     total,
  ...paginationData,
};
  // ContactCollection.find();
};
export const getContactById = (id) => {
  return ContactCollection.findById(id);
};

export const addContact = (payload) => {
  return ContactCollection.create(payload);
}; //додаємо в базу об'єкт і повертаємо його з id

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    upsert,
    includeResultMetadata: true,
  });
  if (!result || !result.value) return null;
  const isNew = Boolean(result.lastErrorObject.upserted); // якщо є строка з id-true(новий об'єкт), нема - undefined(false)-оновлений об'єкт
  return {
    isNew, //повертаємо додали чи ні
    data: result.value, //повертаємо сам об'єкт
  };
};

export const deleteContact = (filter) => {
  return ContactCollection.findOneAndDelete(filter);
};
