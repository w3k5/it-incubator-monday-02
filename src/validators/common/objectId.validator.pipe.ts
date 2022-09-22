import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BadRequestEmptyException } from '../../_common/errors/exceptions/badRequestEmpty.exception';

export class ObjectIdValidationPipe implements PipeTransform {
	transform(value: any, meta: ArgumentMetadata): ObjectId {
		if (meta.type === 'param') {
			if (ObjectId.isValid(value)) {
				return new ObjectId(value);
			}
			throw new BadRequestEmptyException();
		}
		return value;
	}
}
