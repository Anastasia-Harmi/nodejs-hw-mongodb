import { sortByList } from '../db/models/Contact.js';

const sortOrderList = ['asc', 'desc']; //створюємо масив з можливими порядками сортування

export const parseSortParams = ({ sortBy, sortOrder }) => {
  //отримуємо порядок сортування:
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0]; //якщо порядок сортування який пердали є в списку, то ми цей порядок сортування лишаємо, якщо нема-то за замовчуванням передаємо 1 варіант сортування

  //отримуємо поле:
  const parsedSortBy = sortByList.includes(sortBy) ? sortBy : 'name';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
