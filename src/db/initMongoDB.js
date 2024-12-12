import mongoose from 'mongoose';

export const initMongoDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Anastasia:L03IDfAcMV3rhBn3@cluster0.bkoow.mongodb.net/my-contacts?retryWrites=true&w=majority&appName=Cluster0',
    );
    // const user =
    // const password =
    // const url =
    // const db =
  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
    throw error;
  }
};
