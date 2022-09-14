import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { userService } from '../../../_inversify/inversify.config';
import mongoose from 'mongoose';
import { UserInputInterface, UserOutputInterface } from '../types/entities';
import { ObjectId } from 'mongodb';
import { GetAllUsersQueryParams } from '../controllers/controller.types';
import { SortDirectionEnum } from '../../../enums';

describe('User Service Test', () => {
	let mongoServer: MongoMemoryServer;

	const createFakeUser = (): UserInputInterface => {
		return {
			email: faker.internet.email(),
			login: faker.internet.userName(),
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

	it('Should create valid user with valid input data', async () => {
		const fakeUser = createFakeUser();
		const result: UserOutputInterface = await userService.createUser(fakeUser);

		expect(result).toBeTruthy();
		expect(ObjectId.isValid(result.id)).toBeTruthy();
		expect(!isNaN(Number(new Date(result.createdAt)))).toBeTruthy();
		expect(result.login).toStrictEqual(fakeUser.login);
		expect(result.email).toStrictEqual(result.email);
	});

	it('Should Delete Valid User', async () => {
		const fakeUser = createFakeUser();
		const { id }: UserOutputInterface = await userService.createUser(fakeUser);

		const isDeleted = await userService.deleteUser(id);
		expect(isDeleted).toStrictEqual(true);
	});

	it("Shouldn't Delete user with invalid ID", async () => {
		const fakedId = faker.database.mongodbObjectId();
		const isDeleted = await userService.deleteUser(fakedId);
		expect(isDeleted).toStrictEqual(false);
	});

	it('Get All Users without query', async () => {
		const fakedUsers = [];
		const iterator = Array.from({ length: 20 });
		for (const request of iterator) {
			const fakeUser = createFakeUser();
			const createdUser = await userService.createUser(fakeUser);
			fakedUsers.push(createdUser);
		}
		const revertedFakedUsers = fakedUsers.reverse();
		const [lastCreatedFakeUser] = revertedFakedUsers;
		const queryParams: GetAllUsersQueryParams = {};
		const allUsers = await userService.getAllUsers(queryParams);
		const [firstElementInCreatedDocuments] = allUsers.documents;
		expect(allUsers.totalCount).toStrictEqual(20);
		expect(allUsers.pagesCount).toStrictEqual(2);
		expect(lastCreatedFakeUser).toEqual(firstElementInCreatedDocuments);
	});

	it('Get All Users with query', async () => {
		const fakedUsers = [];
		const pageSize = 5;
		const amountOfFakedUsers = 10;
		const pagesCount = Math.ceil(amountOfFakedUsers / pageSize);
		const iterator = Array.from({ length: amountOfFakedUsers });
		for (const request of iterator) {
			const fakeUser = createFakeUser();
			const createdUser = await userService.createUser(fakeUser);
			fakedUsers.push(createdUser);
		}
		const [lastCreatedFakeUser] = fakedUsers;
		const queryParams: GetAllUsersQueryParams = {
			sortDirection: SortDirectionEnum.asc,
			pageSize,
		};
		const allUsers = await userService.getAllUsers(queryParams);
		const [firstElementInCreatedDocuments] = allUsers.documents;
		expect(allUsers.totalCount).toStrictEqual(amountOfFakedUsers);
		expect(allUsers.pagesCount).toStrictEqual(pagesCount);
		expect(lastCreatedFakeUser).toEqual(firstElementInCreatedDocuments);
	});
});
