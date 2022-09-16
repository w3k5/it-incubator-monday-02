import { BaseMiddleware } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import { NextFunction, Response, Request } from 'express';
import { HttpStatusesEnum } from '../../../enums';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractTokenService } from '../../../services/tokenService/interfaces';
import { AuthUserTokenInterface } from '../../../_common/types';

@injectable()
export class AuthBearerMiddleware extends BaseMiddleware {
	constructor(@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService) {
		super();
	}

	public handler(request: Request, response: Response, next: NextFunction) {
		const authorizationHeader = request.header('authorization');
		if (!authorizationHeader) return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();

		const [protocolName, token] = authorizationHeader.split(' ');

		if (!protocolName || !token || protocolName !== 'Bearer') {
			return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();
		}

		const verified = this.tokenService.verify<AuthUserTokenInterface>(token);

		if (!verified) {
			return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();
		}

		// @ts-ignore
		request.user = verified;

		next();
	}
}
