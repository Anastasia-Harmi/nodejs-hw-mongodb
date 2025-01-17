import { UsersCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

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
