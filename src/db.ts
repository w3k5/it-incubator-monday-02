import { MongoClient } from 'mongodb';
import { BloggerInterface, PostInterface } from './entities';

const dbName = process.env.DB_NAME || 'monday';

export const client = new MongoClient('mongodb://0.0.0.0:27017');
const db = client.db(dbName);

export const bloggersCollection = db.collection<BloggerInterface>('bloggers');
export const postsCollection = db.collection<PostInterface>('posts');

export const runDb = async () => {
	try {
		await client.connect();
		await client.db(dbName).command({ ping: 1 });
		console.log('Connection to Atlas db Success');
	} catch (error) {
		console.log('Something went wrong during connection to database!', error);
		await client.close();
	}
};
