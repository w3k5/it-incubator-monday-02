import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { BlogInputInterface } from '../entities';
import { blogService as OldBlogService, postService } from '../../../_inversify/inversify.config';
import { GetAllBlogQueryParams } from '../types/_blog.common.types';
import { NotFoundError } from '../../../_common/errors';
import { _deprecatedUpdateBlogRepositoryDto } from '../dto/_deprecated.updateBlogRepositoryDto';
import { PostInputInterface } from '../../post/entities';

describe('Blog Service tests', () => {
	let mongoServer: MongoMemoryServer;

	const createFakeBlog = (): BlogInputInterface => {
		return {
			name: faker.internet.userName(),
			youtubeUrl: faker.internet.url(),
		};
	};

	// const createFakePost = (blogId: string): PostInputInterface => {
	// 	return {
	// 		blogId,
	// 		title: faker.company.name(),
	// 		shortDescription: faker.commerce.productDescription(),
	// 		content: faker.lorem.paragraph(10),
	// 	};
	// };

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
		await OldBlogService.drop();
	});

	it('Должен создать новый блог', async () => {
		const blogMock: BlogInputInterface = createFakeBlog();
		const { createdAt, name, youtubeUrl, id } = await OldBlogService.createBlog(blogMock);
		expect(name).toStrictEqual(blogMock.name);
		expect(youtubeUrl).toStrictEqual(blogMock.youtubeUrl);
		expect(ObjectId.isValid(id)).toBeTruthy();
		expect(!isNaN(Number(new Date(createdAt)))).toBeTruthy();
	});

	it('Должен вернуть все блоги с пустыми квери параметрами (20 блогов)', async () => {
		const fakedBlogs = [];
		const iterator = Array.from({ length: 20 });
		for (const request of iterator) {
			const blogMock: BlogInputInterface = createFakeBlog();
			const fakedBlog = await OldBlogService.createBlog(blogMock);
			fakedBlogs.push(fakedBlog);
		}
		const revertedFakedBlogs = fakedBlogs.reverse();
		const lastCreatedFakedUser = revertedFakedBlogs[0];
		const queryParams: GetAllBlogQueryParams = {};
		const allBlogs = await OldBlogService.getAllBlogs(queryParams);
		const firstElementInDocuments = allBlogs.documents[0];
		expect(allBlogs.totalCount).toStrictEqual(20);
		expect(allBlogs.pagesCount).toStrictEqual(2);
		expect(firstElementInDocuments).toEqual(lastCreatedFakedUser);
	});

	it('Должен вернуть пустые блоги (0 блогов)', async () => {
		const queryParams: GetAllBlogQueryParams = {};
		const allBlogs = await OldBlogService.getAllBlogs(queryParams);
		expect(allBlogs.documents.length).toStrictEqual(0);
		expect(allBlogs.totalCount).toStrictEqual(0);
		expect(allBlogs.pagesCount).toStrictEqual(0);
	});

	it('Должен вернуть блог по ID', async () => {
		const { createdAt, name, youtubeUrl, id } = await OldBlogService.createBlog(createFakeBlog());
		const blogCandidate = await OldBlogService.getBlogById(id);
		expect(blogCandidate).toEqual({ createdAt, name, youtubeUrl, id });
	});

	it('Должен удалить существующий блог по ID', async () => {
		const { id } = await OldBlogService.createBlog(createFakeBlog());
		const isDeleted = await OldBlogService.deleteBlogById(id);
		expect(isDeleted).toStrictEqual(true);
	});

	it('Не должен удалить несуществующий блог по ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		const isDeleted = await OldBlogService.deleteBlogById(notRealId);
		expect(isDeleted).toStrictEqual(false);
	});

	it('Должен обновить существующий блог по ID', async () => {
		const { id } = await OldBlogService.createBlog(createFakeBlog());
		const updateData: _deprecatedUpdateBlogRepositoryDto = createFakeBlog();
		const isUpdated = await OldBlogService.updateBlogById(id, updateData);
		expect(isUpdated).toStrictEqual(true);
		const updatedBlog = await OldBlogService.getBlogById(id);
		expect(updatedBlog.name).toStrictEqual(updateData.name);
		expect(updatedBlog.youtubeUrl).toStrictEqual(updateData.youtubeUrl);
	});

	it('Не должен обновить несуществующий блог по ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		const { id } = await OldBlogService.createBlog(createFakeBlog());
		const updateData: _deprecatedUpdateBlogRepositoryDto = createFakeBlog();
		const isUpdated = await OldBlogService.updateBlogById(notRealId, updateData);
		expect(isUpdated).toStrictEqual(false);
		const updatedBlog = await OldBlogService.getBlogById(id);
		expect(updatedBlog.name).not.toStrictEqual(updateData.name);
		expect(updatedBlog.youtubeUrl).not.toStrictEqual(updateData.youtubeUrl);
	});

	it('Не должен вернуть блог с несуществующим ID', async () => {
		const notRealId = faker.database.mongodbObjectId();
		let error: any;
		try {
			await OldBlogService.getBlogById(notRealId);
		} catch (e: any) {
			error = e;
		}

		expect(error).toBeTruthy();
		expect(error).toBeInstanceOf(NotFoundError);
	});
});
