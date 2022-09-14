import { mongoIdParamValidator } from '../params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { bloggerParamIdValidator } from '../post-validators/blogger-id-validator';

// export const getOneBloggerParamsValidators = [mongoIdParamValidator, inputValidationMiddleware];
export const getOneBloggerParamsValidators = [mongoIdParamValidator];
