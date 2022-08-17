import request from 'supertest';
import { app } from '../../index';
import {
	BloggerInterface,
	CreatePostInterface,
	PostInterface,
	UpdatePostType,
} from '@app/interfaces';
import { HttpStatusesEnum } from '../../enums';
import exp from 'constants';

describe('/bloggers', () => {
	beforeAll(async () => {
		await request(app).delete('/api/videos');
	});

	it('Should return 200 and empty array of bloggers', async () => {
		await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK, []);
	});

	it("Shouldn't create new blogger with empty data", async () => {
		const { body: errorMessages } = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.BAD_REQUEST);
		expect(errorMessages).toEqual({
			errorMessages: [
				{
					field: 'name',
					message: expect.any(String),
				},
				{
					field: 'name',
					message: expect.any(String),
				},
				{
					field: 'youtubeUrl',
					message: expect.any(String),
				},
				{
					field: 'youtubeUrl',
					message: expect.any(String),
				},
				{
					field: 'youtubeUrl',
					message: expect.any(String),
				},
			],
		});
		await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK, []);
	});

	it("Shouldn't create new blogger with empty name", async () => {
		const { body: errorMessages } = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.send({ youtubeUrl: 'https://vk.com' })
			.expect(HttpStatusesEnum.BAD_REQUEST);

		expect(errorMessages).toEqual({
			errorMessages: [
				{
					message: expect.any(String),
					field: 'name',
				},
				{
					field: 'name',
					message: expect.any(String),
				},
			],
		});
		await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK, []);
	});

	it("Shouldn't create new blogger with empty youtubeUrl", async () => {
		const { body: errorsMessages } = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.send({ name: 'Author' })
			.expect(HttpStatusesEnum.BAD_REQUEST);

		expect(errorsMessages).toEqual({
			errorMessages: [
				{
					message: expect.any(String),
					field: 'youtubeUrl',
				},
				{
					message: expect.any(String),
					field: 'youtubeUrl',
				},
				{
					message: expect.any(String),
					field: 'youtubeUrl',
				},
			],
		});

		await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK, []);
	});

	it('Should create new Blogger with valid data without resolution', async () => {
		const createdBlogger = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.send({ name: 'Author', youtubeUrl: 'https://vk.com' })
			.expect(HttpStatusesEnum.CREATED);

		const expectedBlogger: BloggerInterface = {
			name: 'Author',
			youtubeUrl: 'https://vk.com',
			id: expect.any(Number),
		};

		expect(createdBlogger.body).toEqual(expectedBlogger);

		const bloggers = await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(200);
		expect(bloggers.body.length).toEqual(1);
	});

	it("Shouldn't update not exists blogger", async () => {
		await request(app)
			.put(`/api/bloggers/${+new Date() + 12345}`)
			.set('Content-type', 'application/json')
			.send({
				name: 'Author Updated',
				youtubeUrl: 'https://vk.com',
			})
			.expect(HttpStatusesEnum.NOT_FOUND);
	});

	it("Shouldn't update video with bad data", async () => {
		const createdBlogger = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.send({
				name: 'Vladislav',
				youtubeUrl: 'https://youtube.com',
			})
			.expect(HttpStatusesEnum.CREATED);

		const { body } = await request(app)
			.put(`/api/bloggers/${createdBlogger.body.id}`)
			.set('Content-type', 'application/json')
			.send({
				name: '',
				youtubeUrl: '',
			})
			.expect(HttpStatusesEnum.BAD_REQUEST);

		expect(body).toEqual({
			errorMessages: [
				{
					message: expect.any(String),
					field: 'name',
				},
				{
					message: expect.any(String),
					field: 'youtubeUrl',
				},
				{
					message: expect.any(String),
					field: 'youtubeUrl',
				},
			],
		});
	});

	it('Should update blogger', async () => {
		const { body: bloggers } = await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(200);

		expect(bloggers.length).not.toEqual(0);

		const [firstBlogger] = bloggers;

		await request(app)
			.put(`/api/bloggers/${firstBlogger.id}`)
			.set('Content-type', 'application/json')
			.send({
				name: 'Anastasiya',
				youtubeUrl: 'https://instagram.com',
			})
			.expect(HttpStatusesEnum.NO_CONTENT);

		const { body: updatedBlogger } = await request(app)
			.get(`/api/bloggers/${firstBlogger.id}`)
			.set('Content-type', 'application/json');

		expect(updatedBlogger.name).toEqual('Anastasiya');
		expect(updatedBlogger.youtubeUrl).toEqual('https://instagram.com');
	});

	it('Should delete blogger', async () => {
		const response = await request(app)
			.get('/api/bloggers')
			.set('Content-type', 'application/json')
			.expect(200);
		const [firstBlogger] = response.body;

		await request(app)
			.delete(`/api/bloggers/${firstBlogger.id}`)
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.NO_CONTENT);

		await request(app)
			.get(`/api/bloggers/${firstBlogger.id}`)
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.NOT_FOUND);
	});

	it("Shouldn't delete video with bad id", async () => {
		await request(app)
			.delete(`/api/bloggers/lorem`)
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.NOT_FOUND);
	});

	/**
	 * POSTS TEST
	 */

	it('Should return empty array of Posts', async () => {
		await request(app)
			.get('/api/posts')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK, []);
	});

	it('Should create new Posts', async () => {
		const {
			body: { name: bloggerName, id: bloggerId },
		} = await request(app)
			.post('/api/bloggers')
			.set('Content-type', 'application/json')
			.send({ name: 'Author', youtubeUrl: 'https://vk.com' })
			.expect(HttpStatusesEnum.CREATED);

		const responseBody: CreatePostInterface = {
			content: 'My new post',
			shortDescription: 'short post description',
			title: 'Lorem ipsum',
			bloggerId,
		};

		const expectedPost: PostInterface = {
			bloggerId: bloggerId,
			bloggerName: bloggerName,
			content: 'My new post',
			id: expect.any(Number),
			shortDescription: 'short post description',
			title: 'Lorem ipsum',
		};
		const { body: createdPost } = await request(app)
			.post('/api/posts')
			.set('Content-type', 'application/json')
			.send(responseBody)
			.expect(HttpStatusesEnum.CREATED);

		expect(createdPost).toEqual(expectedPost);
	});

	it("Shouldn't create new Posts with empty data", async () => {
		const responseBody = {};

		const { body } = await request(app)
			.post('/api/posts')
			.set('Content-type', 'application/json')
			.send(responseBody)
			.expect(HttpStatusesEnum.BAD_REQUEST);

		expect(body).toEqual({
			errorMessages: [
				{
					message: expect.any(String),
					field: 'content',
				},
				{
					message: expect.any(String),
					field: 'content',
				},
				{
					message: expect.any(String),
					field: 'shortDescription',
				},
				{
					message: expect.any(String),
					field: 'shortDescription',
				},
				{
					message: expect.any(String),
					field: 'title',
				},
				{
					message: expect.any(String),
					field: 'title',
				},
				{
					message: expect.any(String),
					field: 'bloggerId',
				},
			],
		});
	});

	it("Shouldn't create new Posts with exists fields but empty values", async () => {
		const responseBody = {
			content: '',
			shortDescription: '',
			title: '',
			bloggerId: 'a',
		};

		const { body } = await request(app)
			.post('/api/posts')
			.set('Content-type', 'application/json')
			.send(responseBody)
			.expect(HttpStatusesEnum.BAD_REQUEST);

		expect(body).toEqual({
			errorMessages: [
				{
					message: expect.any(String),
					field: 'content',
				},
				{
					message: expect.any(String),
					field: 'shortDescription',
				},
				{
					message: expect.any(String),
					field: 'title',
				},
				{
					message: expect.any(String),
					field: 'bloggerId',
				},
			],
		});
	});

	it("Shouldn't create new Posts with not exists Blogger", async () => {
		const responseBody = {
			content: 'Lorem',
			shortDescription: 'Ipsum',
			title: 'Dolor',
			bloggerId: Date.now() + 1234,
		};

		const { body } = await request(app)
			.post('/api/posts')
			.set('Content-type', 'application/json')
			.send(responseBody)
			.expect(HttpStatusesEnum.NOT_FOUND);
	});

	it("Shouldn't update post with not existing blogger", async () => {
		const { body: posts } = await request(app)
			.get('/api/posts')
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.OK);

		expect(posts.length).toEqual(1);

		const [post] = posts;

		const updateBodyResponse: UpdatePostType = {
			bloggerId: -1,
			content: 'Updated Content',
			shortDescription: 'Updated Desc',
			title: 'Updated Title',
		};

		await request(app)
			.put(`/api/posts/${post.id}`)
			.send(updateBodyResponse)
			.set('Content-type', 'application/json')
			.expect(HttpStatusesEnum.NOT_FOUND);
	});

	// it('Should update post', async () => {
	// 	const {
	// 		body: { id: secondBloggerId, name: secondBloggerName },
	// 	} = await request(app)
	// 		.post('/api/bloggers')
	// 		.set('Content-type', 'application/json')
	// 		.send({ name: 'Vladislav', youtubeUrl: 'https://api.vk.com' })
	// 		.expect(HttpStatusesEnum.CREATED);
	//
	// 	expect(secondBloggerName).toEqual('Vladislav');
	//
	// 	const { body: posts } = await request(app)
	// 		.get('/api/posts')
	// 		.set('Content-type', 'application/json')
	// 		.expect(HttpStatusesEnum.OK);
	//
	// 	expect(posts.length).toEqual(1);
	//
	// 	const [post] = posts;
	//
	// 	const updateBodyResponse = {
	// 		bloggerId: secondBloggerId,
	// 		content: 'Updated Content',
	// 		shortDescription: 'Updated Desc',
	// 		title: 'Updated Title',
	// 	};
	//
	// 	await request(app)
	// 		.put(`/api/posts/${post.id}`)
	// 		.send(updateBodyResponse)
	// 		.set('Content-type', 'application/json')
	// 		.expect(HttpStatusesEnum.NO_CONTENT);
	//
	// 	const { body: updatedPost } = await request(app)
	// 		.get(`/api/posts/${post.id}`)
	// 		.set('Content-type', 'application/json')
	// 		.expect(HttpStatusesEnum.OK);
	//
	// 	expect(updatedPost).toEqual({
	// 		...updateBodyResponse,
	// 	});
	// });

	/**
	 * MIDDLEWARE TEST
	 */

	it('Should return 400 Bad Request with bad content-type', async () => {
		await request(app)
			.get('/')
			.set('Content-type', 'text/plain')
			.expect(HttpStatusesEnum.BAD_REQUEST);
	});
});
