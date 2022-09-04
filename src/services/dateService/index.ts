import 'reflect-metadata';
import { injectable } from 'inversify';
import { DateServiceInterface } from './interfaces';
import { IsoDate } from '@models/user/types/primitives';

const dayjs = require('dayjs');

@injectable()
export class DateService implements DateServiceInterface {
	iso(): IsoDate {
		return dayjs().toISOString();
	}
}
