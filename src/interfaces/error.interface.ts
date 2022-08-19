export interface ErrorInterface {
	field: string;
	message: string;
}

export interface ErrorMessageInterface {
	errorsMessages: ErrorInterface[];
}
