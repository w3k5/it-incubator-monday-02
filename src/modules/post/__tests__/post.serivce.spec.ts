import { postService } from '../../../_inversify/inversify.config';

describe('Post Service tests', () => {
	it('Should test is ioc container returns postService', () => {
		expect(postService);
	});
});
