import { Router } from 'express';
import { testingService } from '../_inversify/inversify.config';

// const testingDomain = new TestingDomain();

export const testingRouter = Router();

// TODO: Testing service
testingRouter.delete('/all-data', (testingService as any).dropAllCollections.bind(testingService));
