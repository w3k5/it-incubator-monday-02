import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { AbstractTokenService, Token } from './interfaces';

config();

@injectable()
export class TokenService implements AbstractTokenService {
	verify<T>(token: Token): false | T {
		const secret = process.env.SECRET;
		if (!secret) {
			throw new Error('SECRET IS NOT PROVIDED');
		}

		try {
			return jwt.verify(token, secret) as T;
		} catch (error) {
			return false;
		}
	}

	generate(data: string | object | Buffer): string {
		const secret = process.env.SECRET;
		if (!secret) {
			throw new Error('SECRET IS NOT PROVIDED');
		}
		return jwt.sign(data, secret, { expiresIn: '1d' });
	}
}
