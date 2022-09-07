import { injectable } from 'inversify';
import { DateServiceInterface } from './interfaces';
import { IsoDate } from '../../modules/_base/types';

const dayjs = require('dayjs');

@injectable()
export class DateService implements DateServiceInterface {
	iso(): IsoDate {
		return dayjs().toISOString();
	}
}
