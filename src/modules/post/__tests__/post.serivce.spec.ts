import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogInputInterface, BlogOutputInterface } from '../../blogs/entities';
import { faker } from '@faker-js/faker';
import { PostInputInterface, PostInputUpdateInterface, PostOutputInterface } from '../entities';
import { ErrorInterface } from '../../../interfaces';
import mongoose from 'mongoose';
import { blogService, postService } from '../../../_inversify/inversify.config';
import request from 'supertest';
import { app } from '../../../app';
import { HttpStatusesEnum } from '../../../enums';

config();

describe('e2e Post Service tests', () => {
	const adminLogin = process.env.LOGIN;
	const adminPassword = process.env.PASSWORD;

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

	if (!adminLogin || !adminPassword) {
		throw new Error('Admin Login or Admin Password was not provided in ENV!');
	}

	describe('Create Post', () => {
		const firstValidUser: BlogInputInterface = createFakeValidBlog();
		const secondValidUser: BlogInputInterface = createFakeValidBlog();
		let firstCreatedUser: BlogOutputInterface;
		let secondCreatedUser: BlogOutputInterface;

		beforeAll(async () => {
			firstCreatedUser = await blogService.createBlog(firstValidUser);
			secondCreatedUser = await blogService.createBlog(secondValidUser);
			expect(firstCreatedUser).toBeTruthy();
			expect(secondCreatedUser).toBeTruthy();
		});

		it('Should create post with valid data', async () => {
			const fakePost = createFakePost(firstCreatedUser.id);
			const response = await request(app)
				.post(`/posts`)
				.auth(adminLogin, adminPassword, { type: 'basic' })
				.send(fakePost);
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
			const createdPost = response.body as PostOutputInterface;

			const postInDb = await request(app).get(`/posts/${createdPost.id}`);
			expect(postInDb.statusCode).toStrictEqual(HttpStatusesEnum.OK);
			const foundPost = postInDb.body as PostOutputInterface;
			expect(foundPost).toEqual(createdPost);
		});

		it("Shouldn't create post with invalid data", async () => {
			const response = await request(app).post(`/posts`).auth(adminLogin, adminPassword, { type: 'basic' }).send({});
			expect(response.statusCode).toStrictEqual(HttpStatusesEnum.BAD_REQUEST);
			// TODO: descrribe errors
		});

		// it("Shouldn't create post with invalid blogId", async () => {
		// 	const { blogId, ...fakePostWithoutId } = createFakePost(firstCreatedUser.id);
		// 	const response = await request(app)
		// 		.post(`/posts`)
		// 		.auth(adminLogin, adminPassword, { type: 'basic' })
		// 		.send({
		// 			...fakePostWithoutId,
		// 			blogId: faker.database.mongodbObjectId(),
		// 		});
		// 	expect(response.statusCode).toStrictEqual(HttpStatusesEnum.NOT_FOUND);
		// });
	});

	describe('Get Post', () => {
		it.todo('Should return post with valid blogId');
		it.todo("Shouldn't return post with invalid blogId");
	});

	describe('Update Post', () => {
		it('Should update existing post with valid data', async () => {
			try {
				const { name } = createFakeValidBlog();
				const createdFakeBlogResponse = await request(app)
					.post('/blogs')
					.auth(adminLogin, adminPassword, { type: 'basic' })
					.send({ name, youtubeUrl: faker.internet.url() });
				expect(createdFakeBlogResponse.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
				const createdFakeBlog = createdFakeBlogResponse.body as BlogOutputInterface;
				expect(createdFakeBlog.name).toStrictEqual(name);
				expect(createdFakeBlog.youtubeUrl).toStrictEqual('https://firstblog.url');

				const fakePost = createFakePost(createdFakeBlog.id);
				const createdFakePostResponse = await request(app)
					.post('/posts')
					.auth(adminLogin, adminPassword, { type: 'basic' })
					.send(fakePost);
				expect(createdFakePostResponse.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
				const createdFakePost = createdFakePostResponse.body as PostOutputInterface;
				expect(createdFakePost.blogId).toStrictEqual(createdFakeBlog.id);
				expect(createdFakePost.blogName).toStrictEqual(createdFakeBlog.name);
				expect(createdFakePost.title).toStrictEqual(fakePost.title);
				expect(createdFakePost.shortDescription).toStrictEqual(createdFakePost.shortDescription);
				expect(createdFakePost.content).toStrictEqual(createdFakePost.content);

				const createdSecondBlog = createFakeValidBlog();
				const createdSecondBlogResponse = await request(app)
					.post('/blogs')
					.auth(adminLogin, adminPassword, { type: 'basic' })
					.send({ name: createdSecondBlog.name, youtubeUrl: 'https://valid.url' });
				expect(createdSecondBlogResponse.statusCode).toStrictEqual(HttpStatusesEnum.CREATED);
				const createdSecondFakeBlog = createdSecondBlogResponse.body as BlogOutputInterface;
				expect(createdSecondFakeBlog.name).toStrictEqual(createdSecondBlog.name);
				expect(createdSecondFakeBlog.youtubeUrl).toStrictEqual('https://valid.url');

				const updatePostData: PostInputUpdateInterface = {
					blogId: createdSecondFakeBlog.id,
					content: 'Updated content',
					title: 'Updated title',
					shortDescription: 'Updated Short Description',
				};
				const updatePostResponse = await request(app)
					.put(`/posts/${createdFakePost.id}`)
					.auth(adminLogin, adminPassword, { type: 'basic' })
					.send(updatePostData);

				expect(updatePostResponse.statusCode).toStrictEqual(HttpStatusesEnum.NO_CONTENT);

				const refetchPostByIdResponse = await request(app).get(`/posts/${createdFakePost.id}`).send();
				expect(refetchPostByIdResponse.statusCode).toStrictEqual(HttpStatusesEnum.OK);
			} catch (error) {
				return error;
			}
		});
	});
});
