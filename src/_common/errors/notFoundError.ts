import { HttpStatusesEnum } from '../../enums';

export class NotFoundError extends Error {
	constructor(message = 'Not Found', status = HttpStatusesEnum.NOT_FOUND) {
		super(JSON.stringify({ message, status }));
	}
}
