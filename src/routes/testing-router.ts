import { Router } from 'express';
import { TestingDomain } from '../domains/testing.domain';

const testingDomain = new TestingDomain();

export const testingRouter = Router();

testingRouter.delete('/all-data', testingDomain.dropAllCollections);
