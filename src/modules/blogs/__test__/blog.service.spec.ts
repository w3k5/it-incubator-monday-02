import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { BlogInputInterface } from '../entities';
import { blogService } from '../../../_inversify/inversify.config';
import { GetAllBlogQueryParams } from '../types/_blog.common.types';
import { NotFoundError } from '../../../_common/errors';
import { UpdateBlogRepositoryDto } from '../dto/updateBlogRepositoryDto';

describe('Blog Service tests', () => {
	let mongoServer: MongoMemoryServer;

	const createFakeUser = (): BlogInputInterface => {
		return {
			name: faker.internet.userName(),
			youtubeUrl: faker.internet.url(),
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
		await blogService.drop();
	});

	it('Должен создать новый блог', async () => {
		const blogMock: BlogInputInterface = createFakeUser();
		const { createdAt, name, youtubeUrl, id } = await blogService.createBlog(blogMock);
		expect(name).toStrictEqual(blogMock.name);
		expect(youtubeUrl).toStrictEqual(blogMock.youtubeUrl);
		expect(ObjectId.isValid(id)).toBeTruthy();
		expect(!isNaN(Number(new Date(createdAt)))).toBeTruthy();
	});

	it('Должен вернуть все блоги с пустыми квери параметрами (20 блогов)', async () => {
		const fakedBlogs = [];
		for (let i = 0; i < 20; i++) {
			const blogMock: BlogInputInterface = createFakeUser();
			const fakedBlog = await blogService.createBlog(blogMock);
			fakedBlogs.push(fakedBlog);
		}
		const revertedFakedBlogs = fakedBlogs.reverse();
		const lastCreatedFakedUser = revertedFakedBlogs[0];
		const queryParams: GetAllBlogQueryParams = {};
		const allBlogs = await blogService.getAllBlogs(queryParams);
		const firstElementInDocuments = allBlogs.documents[0];
		expect(allBlogs.totalCount).toStrictEqual(20);
		expect(allBlogs.pagesCount).toStrictEqual(2);
		expect(firstElementInDocuments).toEqual(lastCreatedFakedUser);
	});

	it('Должен вернуть блог по ID', async () => {
		const { createdAt, name, youtubeUrl, id } = await blogService.createBlog(createFakeUser());
		const blogCandidate = await blogService.getBlogById(id);
		expect(blogCandidate).toEqual({ createdAt, name, youtubeUrl, id });
	});

	it('Должен удалить существующий блог по ID', async () => {
		const { id } = await blogService.createBlog(createFakeUser());
		const isDeleted = await blogService.deleteBlogById(id);
		expect(isDeleted).toStrictEqual(true);
	});

	it('Не должен удалить несуществующий блог по ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		const isDeleted = await blogService.deleteBlogById(notRealId);
		expect(isDeleted).toStrictEqual(false);
	});

	it('Должен обновить существующий блог по ID', async () => {
		const { id } = await blogService.createBlog(createFakeUser());
		const updateData: UpdateBlogRepositoryDto = createFakeUser();
		const isUpdated = await blogService.updateBlogById(id, updateData);
		expect(isUpdated).toStrictEqual(true);
		const updatedBlog = await blogService.getBlogById(id);
		expect(updatedBlog.name).toStrictEqual(updateData.name);
		expect(updatedBlog.youtubeUrl).toStrictEqual(updateData.youtubeUrl);
	});

	it('Не должен обновить несуществующий блог по ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		const { id } = await blogService.createBlog(createFakeUser());
		const updateData: UpdateBlogRepositoryDto = createFakeUser();
		const isUpdated = await blogService.updateBlogById(notRealId, updateData);
		expect(isUpdated).toStrictEqual(false);
		const updatedBlog = await blogService.getBlogById(id);
		expect(updatedBlog.name).not.toStrictEqual(updateData.name);
		expect(updatedBlog.youtubeUrl).not.toStrictEqual(updateData.youtubeUrl);
	});

	it('Не должен вернуть блог с несуществующим ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		let error: any;
		try {
			await blogService.getBlogById(notRealId);
		} catch (e: any) {
			error = e;
		}

		expect(error).toBeTruthy();
		expect(error).toBeInstanceOf(NotFoundError);
	});
});