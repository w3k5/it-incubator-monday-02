import { Router } from 'express';
import { dropAllCollections } from './handlers';

export const testingRouter = Router();

testingRouter.delete('/all-data', dropAllCollections);
