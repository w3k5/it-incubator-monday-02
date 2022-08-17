import { VideoInterface } from '../interfaces/video.interface';

export type UpdateVideoType = Pick<
	VideoInterface,
	| 'title'
	| 'author'
	| 'availableResolutions'
	| 'canBeDownloaded'
	| 'minAgeRestriction'
	| 'publicationDate'
>;
