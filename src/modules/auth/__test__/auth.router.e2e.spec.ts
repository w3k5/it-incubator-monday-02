import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { UserInputInterface } from '../../user/types/entities';
import { ErrorInterface } from '../../../interfaces';
import { userService } from '../../../_inversify/inversify.config';
import { HttpStatusesEnum } from '../../../enums';

describe('E2E Auth Router Test', () => {
	let mongoServer: MongoMemoryServer;

	const createFakeValidUser = (): UserInputInterface => {
		return {
			email: faker.internet.email(),
			login: faker.internet.userName().slice(0, 7),
			password: faker.internet.password(),
		};
	};

	const generateError = (field: string): ErrorInterface => {
		return {
			message: expect.any(String),
			field,
		};
	};

	const generateErrorsObjectByErrorArray = (errors: ErrorInterface[]) => {
		return {
			errorsMessages: errors,
		};
	};

	const loginError = generateError('login');
	const passwordError = generateError('password');

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

	describe('[POST /] Auth Route', () => {
		let { login, email, password }: UserInputInterface = createFakeValidUser();

		beforeAll(async () => {
			const createdUser = await userService.createUser({ login, email, password });
			expect(createdUser).toBeTruthy();
		});

		it('204 Auth with valid login password', async () => {
			const response = await request(app).post('/auth/login').send({ login, password });
			expect(response.statusCode).toEqual(HttpStatusesEnum.OK);
		});

		it('401 with bad login', async () => {
			const response = await request(app).post('/auth/login').send({ login: 'badLogin', password });
			expect(response.statusCode).toEqual(HttpStatusesEnum.NOT_AUTHORIZED);
		});

		it('401 with bad password', async () => {
			const response = await request(app).post('/auth/login').send({ login, password: 'badPassword' });
			expect(response.statusCode).toEqual(HttpStatusesEnum.NOT_AUTHORIZED);
		});

		it('400 with bad empty data', async () => {
			const response = await request(app).post('/auth/login').send();
			expect(response.statusCode).toEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObjectByErrorArray([loginError, passwordError]);
			expect(response.body).toEqual(expectedErrors);
		});

		it('400 with bad empty login', async () => {
			const response = await request(app).post('/auth/login').send({ password });
			expect(response.statusCode).toEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObjectByErrorArray([loginError]);
			expect(response.body).toEqual(expectedErrors);
		});

		it('400 with bad empty password', async () => {
			const response = await request(app).post('/auth/login').send({ login });
			expect(response.statusCode).toEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObjectByErrorArray([passwordError]);
			expect(response.body).toEqual(expectedErrors);
		});
	});
});
