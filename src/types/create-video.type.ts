import { VideoInterface } from '@interfaces';

export type CreateVideoType = Pick<
	VideoInterface,
	'title' | 'author' | 'availableResolutions'
>;
