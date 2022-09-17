import { UserEmail } from '../../modules/_base/types';

export abstract class AbstractMailerService {
	abstract sendMessage: (email: UserEmail, emailBody: string) => Promise<void>;
}
