import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit; //скільки пропустити {} з початку колекції
  const contactsQuery = ContactCollection.find(); //Створюється початковий запит до колекції контактів за допомогою Mongoose

  if (filters.type) {
    //Якщо умова в попередньому рядку була істинною (тобто значення для filter.type існує), цей рядок виконує фільтрацію в запиті contactsQuery
    contactsQuery.where('contactType').equals(filters.type); //Викликається метод where на об'єкті contactsQuery,метод equals, щоб порівняти значення в полі contactType з переданим значенням filter.type. Якщо значення в полі contactType дорівнює значенню в filter.type, то результат запиту буде включати ці контакти.
  }

  if (filters.isFavourite) {
    contactsQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const totalItems = await ContactCollection.find()
    .merge(contactsQuery) //.merge() не змінює сам contactsQuery, а додає умови (фільтри, сортування тощо) з цього запиту до основного запиту ContactCollection.find().
    .countDocuments(); // countDocuments повертає загальну кількість обєктів

  const data = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder }); // пропусти перші skip об'єкта і поверни наступні limit, відсортує за полем sortBy і значенням sortOrder

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
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
