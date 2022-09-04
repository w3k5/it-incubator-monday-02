export type Token = string;

export type AccessToken = { accessToken: Token };

export abstract class AbstractTokenService {
	abstract generate: (data: string | object | Buffer) => string;
}
