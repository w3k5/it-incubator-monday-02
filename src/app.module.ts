import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { BlogsModule } from './modules/blogs/blogs.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URI!, {
			dbName: process.env.DB_NAME,
		}),
		BlogsModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
