import { config } from 'dotenv';
import mongoose from 'mongoose';

config();
const dbName = process.env.DB_NAME || 'monday';
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
	console.log('process env', process.env);
	throw new Error('Something wrong with MongoDB uri');
}

export const runDb = async () => {
	try {
		await mongoose.connect(dbUri, { dbName });
		console.log('Mongoose connected');
	} catch (error) {
		console.log('Something went wrong during connection to database!', error);
		await mongoose.disconnect();
	}
};
