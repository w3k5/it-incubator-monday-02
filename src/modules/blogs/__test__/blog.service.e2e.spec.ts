import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { blogService, postService, userService } from '../../../_inversify/inversify.config';
import mongoose from 'mongoose';
import { PostInputInterface, PostOutputInterface } from '../../post/entities';
import request from 'supertest';
import { app } from '../../../app';
import { BlogInputInterface, BlogOutputInterface } from '../entities';
import { HttpStatusesEnum } from '../../../enums';
import { GetAllEntities } from '../../../_common/types';
import { ErrorInterface } from '../../../interfaces';

describe('e2e Blog Router Tests', () => {
	const adminLogin = process.env.LOGIN;
	const adminPassword = process.env.PASSWORD;

	if (!adminLogin || !adminPassword) {
		throw new Error('Admin Login or Admin Password was not provided in ENV!');
	}

	let mongoServer: MongoMemoryServer;

	const createFakeValidBlog = (): BlogInputInterface => {
		return {
			youtubeUrl: faker.internet.url(),
			name: faker.internet.userName().slice(0, 7),
		};
	};

	const createFakePost = (blogId: string): PostInputInterface => {
		return {
			blogId,
			title: faker.company.name(),
			shortDescription: faker.commerce.productDescription().slice(0, 100),
			content: faker.lorem.paragraph(10),
		};
	};

	const generateError = (field: string): ErrorInterface => {
		return {
			message: expect.any(String),
			field,
		};
	};

	const blogIdError = generateError('blogId');

	const generateErrorsObjectByErrorArray = (errors: ErrorInterface[]) => {
		return {
			errorsMessages: errors,
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
		// await userService.drop();
	});
	describe('Get Posts by Blog ID', () => {
		const firstValidUser: BlogInputInterface = createFakeValidBlog();
		const secondValidUser: BlogInputInterface = createFakeValidBlog();
		let firstCreatedUser: BlogOutputInterface;
		let secondCreatedUser: BlogOutputInterface;

		beforeAll(async () => {
			firstCreatedUser = await blogService.createBlog(firstValidUser);
			secondCreatedUser = await blogService.createBlog(secondValidUser);
			expect(firstCreatedUser).toBeTruthy();
			expect(secondCreatedUser).toBeTruthy();
			const amountOfPosts = 20;
			const iterator = Array.from({ length: amountOfPosts });
			const createdPostOfFirstUser = [];
			for (const post of iterator) {
				const fakePost = createFakePost(firstCreatedUser.id);
				const createdPost = await postService.createPost(fakePost);
				createdPostOfFirstUser.push(createdPost);
			}
		});

		it('200 Should Return all posts by valid blog ID', async () => {
			const response = await request(app).get(`/blogs/${firstCreatedUser.id}/posts`);
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.OK);
			const body = response.body as GetAllEntities<BlogOutputInterface>;
			expect(body.totalCount).toStrictEqual(20);
		});

		it("404 Shouldn't return all posts by not existing blog ID", async () => {
			const notRealBlogId = faker.database.mongodbObjectId();
			const response = await request(app).get(`/blogs/${notRealBlogId}/posts`);
			expect(response.statusCode).toEqual(HttpStatusesEnum.NOT_FOUND);
			expect(response.body).toEqual({});
		});

		it('400 Shouldn return error with invalid param id', async () => {
			const notId = faker.random.numeric(10);
			const response = await request(app).get(`/blogs/${notId}/posts`);
			expect(response.statusCode).toEqual(HttpStatusesEnum.BAD_REQUEST);
			const expectedErrors = generateErrorsObjectByErrorArray([blogIdError]);
			expect(response.body).toEqual(expectedErrors);
		});
	});

	describe('Create Post by Blog ID', () => {
		const firstValidUser: BlogInputInterface = createFakeValidBlog();
		const secondValidUser: BlogInputInterface = createFakeValidBlog();
		let firstCreatedUser: BlogOutputInterface;
		let secondCreatedUser: BlogOutputInterface;

		beforeAll(async () => {
			firstCreatedUser = await blogService.createBlog(firstValidUser);
			secondCreatedUser = await blogService.createBlog(secondValidUser);
			expect(firstCreatedUser).toBeTruthy();
			expect(secondCreatedUser).toBeTruthy();
			// const amountOfPosts = 20;
			// const iterator = Array.from({ length: amountOfPosts });
			// const createdPostOfFirstUser = [];
			// for (const post of iterator) {
			// 	const fakePost = createFakePost(firstCreatedUser.id);
			// 	const createdPost = await postService.createPost(fakePost);
			// 	createdPostOfFirstUser.push(createdPost);
			// }
		});

		it('Should create new post for valid blog id', async () => {
			const fakePost = createFakePost(firstCreatedUser.id);
			const response = await request(app)
				.post(`/blogs/${firstCreatedUser.id}/posts`)
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send(fakePost);
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
			const { title, shortDescription, blogId, blogName, content } = response.body as PostOutputInterface;
			expect(title).toStrictEqual(fakePost.title);
			expect(shortDescription).toStrictEqual(fakePost.shortDescription);
			expect(blogId).toStrictEqual(firstCreatedUser.id);
			expect(blogName).toStrictEqual(firstCreatedUser.name);
			expect(content).toStrictEqual(fakePost.content);
		});

		it("Shouldn't create new post for invalid blog id", async () => {
			const fakeId = faker.database.mongodbObjectId();
			const fakePost = createFakePost(firstCreatedUser.id);
			const response = await request(app)
				.post(`/blogs/${fakeId}/posts`)
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send(fakePost);
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.NOT_FOUND);
		});

		it("Shouldn't create new post without credentials", async () => {
			const fakePost = createFakePost(firstCreatedUser.id);
			const response = await request(app).post(`/blogs/${firstCreatedUser.id}/posts`).send(fakePost);
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.NOT_AUTHORIZED);
		});

		it("Shouldn't create new post for valid blog id and invalid post data", async () => {
			const response = await request(app)
				.post(`/blogs/${firstCreatedUser.id}/posts`)
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send({});
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.BAD_REQUEST);
		});
	});
});
