import mongoose, { Schema } from 'mongoose';
import { UserDatabase } from '@models/user/types/entities';

const UserSchema = new Schema<UserDatabase>({
	createdAt: { type: String, required: true },
	login: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
});

const UserModel = mongoose.model('users', UserSchema);

export { UserModel };
