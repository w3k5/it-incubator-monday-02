import { CreateBlogDto } from '../dto/createBlog.dto';
import { NestExpressApplication } from '@nestjs/platform-express';
import supertest from 'supertest';
import { Test } from '@nestjs/testing';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';
import { BlogsModule } from '../blogs.module';
import { HttpStatus } from '@nestjs/common';

describe('Test e2e Blog nest', () => {
	let app: NestExpressApplication;
	let mongoServer: MongoMemoryServer;

	const validBlog: CreateBlogDto = {
		name: 'Valid Blog',
		youtubeUrl: 'www.website.com',
	};

	const apiClient = () => {
		return supertest(app.getHttpServer());
	};

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri);

		const moduleRef = await Test.createTestingModule({
			imports: [MongooseModule.forRoot(uri, { dbName: 'test' }), BlogsModule],
		}).compile();

		app = moduleRef.createNestApplication<NestExpressApplication>();
		await app.listen(3333);
	});

	afterAll(async () => {
		await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
		await app.close();
	});

	it('Should create blog with valid data', async () => {
		const response = await apiClient().post('/v2/blogs').send(validBlog);
		expect(response).toBeTruthy();
		expect(response.statusCode).toStrictEqual(HttpStatus.CREATED);
		expect(response.body.name).toStrictEqual(validBlog.name);
		expect(response.body.youtubeUrl).toStrictEqual(validBlog.youtubeUrl);
	});

	// it("Shouldn't create blog with empty data", async () => {
	// 	const response = await apiClient().post('/v2/blogs').send({});
	// 	try {
	// 		expect(response).toBeTruthy();
	// 		expect(response.statusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
	// 	} catch (error) {
	// 		console.log({ response });
	// 		console.log(error);
	// 		throw error;
	// 	}
	// });
	it.todo("Shouldn't create blog with empty youtubeUrl");
	it.todo("Shouldn't create blog with short youtubeUrl");
	it.todo("Shouldn't create blog with long youtubeUrl");
	it.todo("Shouldn't create blog with empty name");
	it.todo("Shouldn't create blog with short name");
	it.todo("Shouldn't create blog with long name");
});
