import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDatabase } from './entities';
import { AbstractBlogsCommandRepository } from './_abstract/_abstract.blogs.command-repository';
import { AbstractDateService } from '../../services/dateService/interfaces';
import { CreateBlogDto } from './dto/createBlog.dto';

@Injectable()
export class BlogsCommandRepository implements AbstractBlogsCommandRepository {
	constructor(
		private readonly dateService: AbstractDateService,
		@InjectModel('blogs') private readonly BlogModel: Model<BlogDatabase>,
	) {}

	async create({ name, youtubeUrl }: CreateBlogDto): Promise<BlogDatabase> {
		const createdAt = this.dateService.now();
		return this.BlogModel.create({ name, youtubeUrl, createdAt });
	}

	async updateById(_id: ObjectId, { name, youtubeUrl }: CreateBlogDto): Promise<boolean> {
		const updateResult = await this.BlogModel.updateOne({ _id }, { name, youtubeUrl });
		return !!updateResult.modifiedCount;
	}

	async delete(_id: ObjectId): Promise<boolean> {
		const deleteResult = await this.BlogModel.deleteOne({ _id });
		return !!deleteResult.deletedCount;
	}

	async drop(): Promise<void> {
		await this.BlogModel.deleteMany({});
	}
}
