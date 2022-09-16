import { HttpStatusesEnum } from '../enums';

export interface ErrorInterface {
	field: string;
	message: string;
}

export interface ErrorMessageInterface {
	errorsMessages: ErrorInterface[];
}

export interface ServerErrorInterface {
	status: HttpStatusesEnum;
	message: string;
	error: string;
	route: string;
	endpoint: string;
}
