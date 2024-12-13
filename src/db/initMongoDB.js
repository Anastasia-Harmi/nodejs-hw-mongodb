import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
// const dbHost = getEnvVar("DB_HOST"); //коли всю ссилку винесли в
export const initMongoDB = async () => {
  try {
    const user = getEnvVar("MONGOBB_USER");
    const password = getEnvVar("MONGOBB_PASSWORD");
    const url = getEnvVar("MONGOBB_URL");
    const db = getEnvVar("MONGOBB_DB");
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Mongo connection successfully established!');

  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
    throw error;
  }
};
