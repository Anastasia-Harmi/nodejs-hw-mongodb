import ContactCollection from '../db/models/Contact.js';

export const getContacts = () => {
  // throw new Error("Database error");
  ContactCollection.find();
};
export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload); //додаємо в базу об'єкт і повертаємо його з id

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = true;
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

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
