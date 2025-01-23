import path from 'node:path';

export const FIFTEEN_MINUTES = 15 * 60 * 1000; //15хв
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; //30днів

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.resolve('src', 'templates');
export const UPLOADS_DIR = path.resolve('uploads');
