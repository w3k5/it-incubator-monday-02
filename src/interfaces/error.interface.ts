import { HttpStatusesEnum } from '@app/enums';

export interface ErrorInterface {
	field: string;
	message: string;
}

export interface ErrorMessageInterface {
	errorsMessages: ErrorInterface[];
}

export interface ServerErrorInterface {
	status: HttpStatusesEnum.SERVER_ERROR;
	message: 'Internal server error';
	error: string;
	route: string;
	endpoint: string;
}
