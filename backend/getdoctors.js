import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  const doctorModel = mongoose.model('doctor', new mongoose.Schema({}));
  doctorModel.find({}, '_id name').then(docs => {
    console.log(JSON.stringify(docs, null, 2));
    mongoose.connection.close();
  });
}).catch(err => {
  console.error('Error connecting to database:', err);
  process.exit(1);
});
