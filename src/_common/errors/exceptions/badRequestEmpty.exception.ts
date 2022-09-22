import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestEmptyException extends HttpException {
	constructor() {
		super('Bad Request', HttpStatus.BAD_REQUEST);
	}
}
