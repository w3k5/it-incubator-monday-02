import { passwordService } from '../../../_inversify/inversify.config';

describe('Password Service Test', () => {
	it('Должен захешить пароль и вернуть его', async () => {
		const superStrongPassword = 'superStrongPassword111222333';
		const hashedLength = 60;
		const hashResult = await passwordService.hashPassword(superStrongPassword);
		expect(hashResult).toStrictEqual(expect.any(String));
		expect(hashResult.length).toStrictEqual(hashedLength);
	});

	it('Должен сравнить верный пароль и хэш, вернуть true', async () => {
		const superStrongPassword = 'superStrongPassword111222333';
		const hashResult = await passwordService.hashPassword(superStrongPassword);

		const checkResult = await passwordService.check(superStrongPassword, hashResult);

		expect(checkResult).toStrictEqual(true);
	});

	it('Должен сравнить верный пароль и хэш, вернуть false', async () => {
		const superStrongPassword = 'superStrongPassword111222333';
		const notValidaPassword = 'notValidaPassword';
		const hashResult = await passwordService.hashPassword(superStrongPassword);

		const checkResult = await passwordService.check(notValidaPassword, hashResult);

		expect(checkResult).toStrictEqual(false);
	});
});
