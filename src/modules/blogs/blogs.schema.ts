import { BlogDatabase } from './entities';
import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema<BlogDatabase>({
	createdAt: { type: Date, required: true },
	youtubeUrl: { type: String, required: true },
	name: { type: String, required: true },
});

const BlogModel = mongoose.model('blogs', BlogSchema);

export { BlogModel };
