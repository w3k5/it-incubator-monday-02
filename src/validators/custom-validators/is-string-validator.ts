/**
 * If we provide in request field as a number it will convert it into a string, and the value {title: 1} will be valid
 * That validator check that situations and if the value is a pseudo string it throws an error
 * @param value
 * @param fieldName
 */
export const customStringValidator = (value: unknown, fieldName: string) => {
	if (typeof value !== 'string' || !isNaN(+value)) {
		throw new Error(`${fieldName} must be a string!`);
	}
	return true;
};
