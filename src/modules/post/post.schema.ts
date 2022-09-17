import { PostDatabase } from './entities';
import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema<PostDatabase>({
	createdAt: { type: Date, required: true },
	content: { type: String, required: true },
	title: { type: String, required: true },
	blogId: { type: mongoose.Types.ObjectId, required: true },
	shortDescription: { type: String, required: true },
	blogName: { type: String, required: true },
});

const PostModel = mongoose.model('posts', PostSchema);

export { PostModel };
