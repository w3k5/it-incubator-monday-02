import { MongoClient } from 'mongodb';
import { BloggerInterface, PostInterface } from './entities';

const uri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017';
const dbName = process.env.DB_NAME || 'monday';

export const client = new MongoClient(uri);
const db = client.db(dbName);

export const bloggersCollection = db.collection<BloggerInterface>('bloggers');
export const postsCollection = db.collection<PostInterface>('posts');

export const runDb = async () => {
	try {
		await client.connect();
		await client.db(dbName).command({ ping: 1 });
	} catch (error) {
		console.log('Something went wrong during connection to database!', error);
		await client.close();
	}
};
