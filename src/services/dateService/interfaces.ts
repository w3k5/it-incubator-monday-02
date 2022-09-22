import { IsoDate } from '../../modules/_base/types';

export abstract class AbstractDateService {
	abstract iso: () => IsoDate;
	abstract now: () => Date;
	abstract addDays: (date: Date, amountOfDays: number) => Date;
}
