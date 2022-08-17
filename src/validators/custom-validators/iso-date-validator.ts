import { CustomValidator } from 'express-validator';

export const customIsoDateValidator: CustomValidator = (value: any) => {
	const parsedDate = new Date(value).valueOf();
	if (parsedDate < 0 || isNaN(parsedDate)) {
		throw new Error('Date must be in a Date format!');
	}
	return true;
};
