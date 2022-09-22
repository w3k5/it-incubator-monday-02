import { ObjectId } from 'mongodb';
import { CreateBlogDto } from '../dto/createBlog.dto';
import { BlogDatabase } from '../entities';
import { UpdateBlogDto } from '../dto/updateBlog.dto';

export abstract class AbstractBlogsService {
	abstract create: (createBlogDto: CreateBlogDto) => Promise<BlogDatabase>;
	abstract update: (id: ObjectId, updateBlogDto: UpdateBlogDto) => Promise<boolean>;
	abstract delete: (id: ObjectId) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}
