import { Module } from '@nestjs/common';
import { DateService } from './date.service';
import { AbstractDateService } from '../dateService/interfaces';

@Module({
	providers: [
		{
			provide: AbstractDateService,
			useClass: DateService,
		},
	],
	exports: [AbstractDateService],
})
export class DateModule {}
