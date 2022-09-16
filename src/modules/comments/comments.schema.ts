import { CommentDatabaseModel } from './entities';
import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema<CommentDatabaseModel>({
	createdAt: { type: String, required: true },
	content: { type: String, required: true },
	userId: { type: mongoose.Types.ObjectId, required: true },
	postId: { type: mongoose.Types.ObjectId, required: true },
	userLogin: { type: String, required: true },
});

const CommentModel = mongoose.model('comments', CommentSchema);

export { CommentModel };
