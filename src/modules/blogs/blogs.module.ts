import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs.controller';
import { DateModule } from '../../services/date/date.module';
import { BlogSchema } from './blogs.schema';
import { BlogsCommandRepository } from './blogs.command-repository';
import { BlogsQueryRepository } from './blogs.query-repository';
import { AbstractBlogsCommandRepository } from './_abstract/_abstract.blogs.command-repository';
import { AbstractBlogsQueryRepository } from './_abstract/_abstract.blogs.query-repository';
import { AbstractBlogsService } from './_abstract/_abstract.blogs.service';
import { BlogsService } from './blogs.service';

@Module({
	imports: [DateModule, MongooseModule.forFeature([{ name: 'blogs', schema: BlogSchema }])],
	controllers: [BlogsController],
	providers: [
		{
			provide: AbstractBlogsCommandRepository,
			useClass: BlogsCommandRepository,
		},
		{
			provide: AbstractBlogsQueryRepository,
			useClass: BlogsQueryRepository,
		},
		{
			provide: AbstractBlogsService,
			useClass: BlogsService,
		},
	],
	exports: [],
})
export class BlogsModule {}
