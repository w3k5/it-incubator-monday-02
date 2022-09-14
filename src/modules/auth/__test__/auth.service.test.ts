import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserInputInterface } from '@models/user/types/entities';
import { authService, userService } from '../../../_inversify/inversify.config';
import { NotAuthorizedError } from '../../../_common/errors';

describe('Auth Service', () => {
	let mongoServer: MongoMemoryServer;

	const secret = process.env.SECRET;

	if (!secret) {
		throw new Error('Secret was not provided in ENV!');
	}

	const createFakeUser = (): UserInputInterface => {
		return {
			email: faker.internet.email(),
			login: faker.internet.userName().slice(0, 7),
			password: faker.internet.password(),
		};
	};

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	afterEach(async () => {
		await userService.drop();
	});

	it('Auth Valid User and return Token', async () => {
		const { login, password, email } = createFakeUser();
		const createdUser = await userService.createUser({ login, email, password });
		expect(createdUser).toBeTruthy();
		expect(createdUser.email).toStrictEqual(email);
		expect(createdUser.login).toStrictEqual(login);

		const token = await authService.auth({ login, password });
		expect(token).toBeTruthy();
		expect(jwt.verify(token, secret)).toBeTruthy();
	});

	it('Auth valid email invalid password', async () => {
		const { login, password, email } = createFakeUser();
		const wrongPassword = faker.internet.password();

		const createdUser = await userService.createUser({ login, email, password });
		expect(createdUser).toBeTruthy();
		expect(createdUser.email).toStrictEqual(email);
		expect(createdUser.login).toStrictEqual(login);
		let error;

		try {
			await authService.auth({ login, password: wrongPassword });
		} catch (e) {
			error = e;
		}
		expect(error).toBeInstanceOf(NotAuthorizedError);
	});

	it('Invalid email', async () => {
		const notRealEmail = faker.internet.email();
		let error;
		try {
			await authService.auth({ login: notRealEmail, password: '' });
		} catch (e) {
			error = e;
		}
		expect(error).toBeInstanceOf(NotAuthorizedError);
	});
});
