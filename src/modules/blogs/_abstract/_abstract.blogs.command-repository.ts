import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { BlogDatabase } from '../entities';
import { ObjectId } from 'mongodb';
import { CreateBlogDto } from '../dto/createBlog.dto';

export abstract class AbstractBlogsCommandRepository implements AbstractBaseRepository {
	abstract create: (dto: CreateBlogDto) => Promise<BlogDatabase>;
	abstract updateById: (_id: ObjectId, dto: CreateBlogDto) => Promise<boolean>;
	abstract delete: (_id: ObjectId) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}
