import { UsersCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/Session.js';
import { randomBytes } from 'crypto'; //для створ токенів ф-ія
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/usersConstants.js';

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'User already exist');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10); //userData.password - строка(пароль) яку щифруємоб 10-salt
  //Коли ми людину реєструємо, то в поле пароль додаємо вже захешований пароль:
  const newUser = await UsersCollection.create({
    ...userData,
    password: hashedPassword,
  });
  return newUser;
};

export const loginUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email }); //перевіряємо чи є зареєстрована пошта в БД

  if (!user) throw createHttpError(404, 'User not found'); //Якщо її немає, викидуємо помилку

  const isEqual = await bcrypt.compare(userData.password, user.password); //перевіряємо чи сходяться паролі:той,що прийшов і той що в БД захешований з допом.методу bcrypt.compare. Поверне true-парлі співпали,false-не співпали

  if (!isEqual) throw createHttpError(401, 'Unauthorized'); //якщо ні-викидаємо помилку

  await SessionsCollection.deleteOne({ userId: user._id }); //Видаляємо попередню сесію, раптом людина заходила з ін комп.

  const accessToken = randomBytes(30).toString('base64'); //створ аксесТокен=Повертаємо 30випадкових байтів, які перетворюємо методом toString на символи кодуванням base64
  const refreshToken = randomBytes(30).toString('base64'); //створ рефрешТокен

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};
