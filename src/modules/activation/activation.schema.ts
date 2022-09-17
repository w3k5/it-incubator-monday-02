import mongoose, { Schema } from 'mongoose';
import { ActivationDatabaseModel } from './entities';

const ActivationSchema = new Schema<ActivationDatabaseModel>({
	createdAt: { type: Date, required: true },
	expirationAt: { type: Date, required: true },
	userId: { type: mongoose.Types.ObjectId, required: true },
	code: { type: String, required: true },
	isActivated: { type: Boolean, required: true, default: false },
});

const ActivationModel = mongoose.model('activations', ActivationSchema);

export { ActivationModel };
