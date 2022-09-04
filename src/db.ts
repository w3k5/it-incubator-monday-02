import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { BloggerInterface, PostInterface, UserInterface } from './entities';

config();
const dbName = process.env.DB_NAME || 'monday';

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
	throw new Error('MongoDB URI is not defined!');
}

export const client = new MongoClient(dbUri);
const db = client.db(dbName);

export const bloggersCollection = db.collection<BloggerInterface>('bloggers');
export const postsCollection = db.collection<Omit<PostInterface, 'id'>>('posts');
export const usersCollection = db.collection<UserInterface>('users');

const initCollections = async (collections: string[]) => {
	const databaseCollections = await db.listCollections().toArray();
	collections.forEach((collection) => {
		const isCollectionsExists = databaseCollections.find(({ name }) => name === collection);
		if (!isCollectionsExists) {
			db.createCollection(collection);
		}
	});
};

export const runDb = async () => {
	try {
		await initCollections(['bloggers', 'posts', 'users']);
		await client.connect();
		await client.db(dbName).command({ ping: 1 });
		console.log('Connection to Atlas db Success');

		await mongoose.connect(dbUri, { dbName });
		console.log('Mongoose connected');
	} catch (error) {
		console.log('Something went wrong during connection to database!', error);
		await client.close();
	}
};
