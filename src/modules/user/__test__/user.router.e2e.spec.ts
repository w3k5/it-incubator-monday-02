import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { HttpStatusesEnum } from '../../../enums';
import { app } from '../../../app';
import { userService } from '../../../_inversify/inversify.config';
import { GetAllEntities } from '../../../_common/types';
import { UserInputInterface, UserOutputInterface } from '../types/entities';
import { ErrorInterface } from '../../../interfaces';

describe('End 2 End User Router', () => {
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

	const generateErrorsObject = (fields: string[]) => {
		return {
			errorsMessages: fields.map(generateError),
		};
	};

	const adminLogin = process.env.LOGIN;
	const adminPassword = process.env.PASSWORD;

	if (!adminLogin || !adminPassword) {
		throw new Error('Admin Login or Admin Password was not provided in ENV!');
	}

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

	it('Test Get All Request Without query and empty Database', async () => {
		const response = await request(app).get('/users');
		const body: GetAllEntities<UserOutputInterface> = response.body;
		expect(response.statusCode).toEqual(HttpStatusesEnum.OK);

		const { page, pagesCount, totalCount, pageSize, items } = body;

		expect(page).toStrictEqual(1);
		expect(pagesCount).toStrictEqual(0);
		expect(totalCount).toStrictEqual(0);
		expect(pageSize).toStrictEqual(10);
		expect(items).toStrictEqual([]);
	});

	describe('E2E Create User Cases', () => {
		it('E2E [Basic] Создания пользователя с валидными данными', async () => {
			try {
				const fakeUser = createFakeValidUser();
				const response = await request(app)
					.post('/users')
					.auth(adminLogin, adminPassword, { type: 'basic' })
					.send(fakeUser)
					.withCredentials();

				expect(response.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
			} catch (error) {
				console.log(error);
			}
		});

		it('E2E Создания пользователя с валидными данными с невалидными данными авторизации', async () => {
			const fakeUser = createFakeValidUser();
			const fakeAdminName = faker.name.firstName();
			const fakeAdminPassword = faker.internet.password();
			const response = await request(app)
				.post('/users')
				.auth(fakeAdminName, fakeAdminPassword, { type: 'basic' })
				.send(fakeUser)
				.withCredentials();

			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.NOT_AUTHORIZED);
		});

		it('E2E Создание пользователя без данных авторизации', async () => {
			const response = await request(app).post('/users');

			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.NOT_AUTHORIZED);
		});

		it('E2E [Basic] Создание пользователя с пустыми данными в body', async () => {
			const response = await request(app)
				.post('/users')
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send({})
				.withCredentials();

			const { body, statusCode } = response;
			expect(statusCode).toStrictEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObject(['email', 'password', 'login']);
			expect(body).toEqual(expectedErrors);
		});

		it('E2E [Basic] Создание пользователя с коротким паролем, длинным именем и невалидной почтой', async () => {
			const response = await request(app)
				.post('/users')
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send({
					login: 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					email: 'something.com',
					password: '12',
				})
				.withCredentials();

			const { body, statusCode } = response;
			expect(statusCode).toStrictEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObject(['email', 'password', 'login']);
			expect(body).toEqual(expectedErrors);
		});
	});
});
