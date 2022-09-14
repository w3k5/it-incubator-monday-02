import { tokenService } from '../../../_inversify/inversify.config';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

type PlaceholderData = {
	email: string;
	password: string;
};

describe('Test Token Service', () => {
	const secret = process.env.SECRET;

	if (!secret) {
		throw new Error('Secret was not provided in Env!');
	}

	it('Should return error if Secret was not provided', () => {
		const savedToken = process.env.SECRET;
		process.env.SECRET = '';
		expect(() => {
			tokenService.generate('');
		}).toThrowError();
		process.env.SECRET = savedToken;
	});

	it('Should return valid jwt token', () => {
		const data: PlaceholderData = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		};

		const token = tokenService.generate(data);
		const verifyResult = jwt.verify(token, secret) as PlaceholderData;
		expect(verifyResult).toBeTruthy();
		expect(verifyResult.hasOwnProperty('email')).toBeTruthy();
		expect(verifyResult.hasOwnProperty('password')).toBeTruthy();
		expect(verifyResult.email).toStrictEqual(data.email);
		expect(verifyResult.password).toStrictEqual(data.password);
	});
});
