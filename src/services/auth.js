import { UsersCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/Session.js';
import { randomBytes } from 'crypto'; //для створ токенів ф-ія
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/usersConstants.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/usersConstants.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail, TEMPLATES_DIR } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), //час життя токену
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS), //час життя токену
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//скид паролю
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id, //Ідентифікатор користувача
      email, //Електронна пошта користувача
    },
    getEnvVar('JWT_SECRET'), // Секретний ключ для підпису токену
    {
      expiresIn: '15m', // Термін дії токену — 15 хвилин
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM), // Адреса відправника
    to: email, // Адреса отримувача
    subject: 'Reset your password', //Тема листа
    html, //Текст листа з посиланням
  });
};
