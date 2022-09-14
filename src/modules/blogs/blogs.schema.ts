import { BlogDatabase } from './entities';
import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema<BlogDatabase>({
	createdAt: { type: String, required: true },
	youtubeUrl: { type: String, required: true },
	name: { type: String, required: true },
});

const BlogModel = mongoose.model('bloggers', BlogSchema);

export { BlogModel };
