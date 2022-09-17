import { injectable } from 'inversify';
import { DateServiceInterface } from './interfaces';
import { IsoDate } from '../../modules/_base/types';

const dayjs = require('dayjs');

@injectable()
export class DateService implements DateServiceInterface {
	/**
	 * @deprecated требуется хранить в базе реальную дату, а не строку
	 */
	iso(): IsoDate {
		return dayjs().toISOString();
	}

	addDays(date: Date, amountOfDays: number): Date {
		return dayjs(date).add(amountOfDays, 'day');
	}

	now(): Date {
		return new Date();
	}
}
