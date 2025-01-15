//перевіряємо тип(по якому робитимемо фільтрацію) контакту
const parseContactType = (string) => {
  if (typeof string !== 'string') return; //якщо параметр фільтрації прийшов не рядком, то повернеться undefined і функція нічого не робить;

  const validTypes = ['home', 'personal']; // можливі значення для типу контакту

  //Тепер ми перевіряємо, чи входить значення string (перетворене в нижній регістр за допомогою toLowerCase()) у масив validTypes. Таким чином, перевірка нечутлива до регістру.
  if (validTypes.includes(string.toLowerCase())) {
    return string.toLowerCase(); // Якщо значення string є одним із допустимих типів (наприклад, 'home' або 'personal'), то функція повертає це значення в нижньому регістрі
  }

  return; //Якщо перевірка на допустимий тип не пройшла (тобто, значення не є 'home' або 'personal'), функція повертає undefined (тобто нічого не робить).
};

// Мета цієї функції — перетворити рядок на булеве значення для параметра "улюблений контакт".
const parseContactIsFavorite = (value) => {
  if (typeof value !== 'string') return; //перевіряємо, чи є параметр value рядком. Якщо це не так, функція повертає undefined

  if (value.toLowerCase() === 'true') return true; //Це перевірка, чи значення value (перетворене в нижній регістр) є рядком 'true'. Якщо так, то функція повертає булеве значення true
  if (value.toLowerCase() === 'false') return false; //перевіряємо, чи значення value є рядком 'false'. Якщо так, то функція повертає булеве значення false

  return; //Якщо значення не є ані 'true', ані 'false', функція повертає undefined (нічого не робить).
};

//Це оголошення основної функції parseContactFilterParams, яка приймає об'єкт з двома властивостями: type (тип контакту) і isFavourite (чи є контакт улюбленим).
export const parseContactFilterParams = ({ type, isFavourite }) => {
  const parsedType = parseContactType(type); //викликаємо функцію parseContactType для обробки параметра type і зберігаємо результат у змінній parsedType
  const parsedIsFavourite = parseContactIsFavorite(isFavourite); //викликається функція parseContactIsFavorite для обробки параметра isFavourite і зберігається результат у змінній parsedIsFavourite

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
