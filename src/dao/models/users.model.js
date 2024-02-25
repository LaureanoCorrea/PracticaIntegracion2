import { Schema, model } from 'mongoose';

const usersCollection = 'users';

const userSchema = new Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	password: {
		type: String,
	},
	role: {
		type: String,
		enum: ['admin', 'user', 'userpremium'],
		default: 'user',
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

export default model(usersCollection, userSchema);
