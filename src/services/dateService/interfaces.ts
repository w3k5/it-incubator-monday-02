import { IsoDate } from '../../modules/_base/types';

export abstract class DateServiceInterface {
	abstract iso: () => IsoDate;
}
