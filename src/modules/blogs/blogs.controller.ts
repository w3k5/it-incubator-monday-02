import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ObjectIdValidationPipe } from '../../validators/common/objectId.validator.pipe';
import { GetAllBlogsSearchParamsDto } from './dto/getAllBlogsSearchParamsDto';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { AbstractBlogsQueryRepository } from './_abstract/_abstract.blogs.query-repository';
import { AbstractBlogsService } from './_abstract/_abstract.blogs.service';

@Controller('/v2/blogs')
export class BlogsController {
	constructor(
		private readonly blogsQueryRepository: AbstractBlogsQueryRepository,
		private readonly blogsService: AbstractBlogsService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAllBlogs(@Query() searchParams: GetAllBlogsSearchParamsDto) {
		return this.blogsQueryRepository.getAll(searchParams);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ObjectIdValidationPipe())
	async getBlogById(@Param('id') id: ObjectId) {
		return this.blogsQueryRepository.getById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createBlog(@Body() createBlogDto: CreateBlogDto) {
		return this.blogsService.create(createBlogDto);
	}

	@Put(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UsePipes(new ObjectIdValidationPipe())
	async updateBlogById(@Body() updateBlogDto: UpdateBlogDto, @Param('id') id: ObjectId) {
		return this.blogsService.update(id, updateBlogDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UsePipes(new ObjectIdValidationPipe())
	async deleteBlogById(@Param('id') id: ObjectId) {
		const deleteResult = await this.blogsService.delete(id);
		if (!deleteResult) {
			throw new NotFoundException();
		}
		return;
	}
}
