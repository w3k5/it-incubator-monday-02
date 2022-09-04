import { IsoDate } from '@models/user/types/primitives';

export interface DateServiceInterface {
	iso: () => IsoDate;
}
