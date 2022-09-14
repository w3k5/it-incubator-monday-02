import { PostDatabase } from './entities';
import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema<PostDatabase>({
	createdAt: { type: String, required: true },
	content: { type: String, required: true },
	title: { type: String, required: true },
	blogId: { type: String, required: true },
	shortDescription: { type: String, required: true },
	blogName: { type: String, required: true },
});

const PostModel = mongoose.model('posts', PostSchema);

export { PostModel };
