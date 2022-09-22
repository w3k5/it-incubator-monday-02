import { Injectable } from '@nestjs/common';
import { AbstractBlogsService } from './_abstract/_abstract.blogs.service';
import { CreateBlogDto } from './dto/createBlog.dto';
import { BlogDatabase } from './entities';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { ObjectId } from 'mongodb';
import { AbstractBlogsCommandRepository } from './_abstract/_abstract.blogs.command-repository';

@Injectable()
export class BlogsService implements AbstractBlogsService {
	constructor(private readonly blogCommandRepository: AbstractBlogsCommandRepository) {}

	async create({ name, youtubeUrl }: CreateBlogDto): Promise<BlogDatabase> {
		return this.blogCommandRepository.create({ name, youtubeUrl });
	}

	async update(id: ObjectId, { name, youtubeUrl }: UpdateBlogDto): Promise<boolean> {
		return this.blogCommandRepository.updateById(id, { name, youtubeUrl });
	}

	async delete(id: ObjectId): Promise<boolean> {
		return this.blogCommandRepository.delete(id);
	}

	async drop(): Promise<void> {
		return this.blogCommandRepository.drop();
	}
}
