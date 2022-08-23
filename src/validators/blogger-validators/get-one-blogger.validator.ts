import { mongoIdParamValidator } from '../params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';

export const getOneBloggerParamsValidators = [mongoIdParamValidator, inputValidationMiddleware];
