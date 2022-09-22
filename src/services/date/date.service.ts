import { Injectable } from '@nestjs/common';
import { AbstractDateService } from '../dateService/interfaces';
import { IsoDate } from '../../modules/_base/types';

const dayjs = require('dayjs');

@Injectable()
export class DateService implements AbstractDateService {
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
