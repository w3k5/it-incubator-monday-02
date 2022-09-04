import 'reflect-metadata';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { AbstractTokenService } from './interfaces';

config();

@injectable()
export class TokenService implements AbstractTokenService {
	generate(data: string | object | Buffer): string {
		const secret = process.env.SECRET;
		if (!secret) {
			throw new Error('SECRET IS NOT PROVIDED');
		}
		const token = jwt.sign(data, secret, { expiresIn: '1d' });
		return token;
	}
}
