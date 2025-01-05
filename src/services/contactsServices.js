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
  });
  return result;
};
