import { AbstractMailerService } from './mailer.service.abstract';
import nodemailer from 'nodemailer';
import { UserEmail } from '../../modules/_base/types';
import { injectable } from 'inversify';

@injectable()
export class MailerService implements AbstractMailerService {
	public async sendMessage(email: UserEmail, emailBody: string) {
		const smtpHost: string | undefined = process.env.SMTP_HOST;
		const smtpPort: string | undefined = process.env.SMTP_PORT;
		const smtpEmail: string | undefined = process.env.SMTP_EMAIL;
		const smtpPassword: string | undefined = process.env.MAILER_SECRET_PASSWORD;

		if (!smtpHost || !smtpPort || !smtpPassword || !smtpEmail) {
			throw new Error('Something of ENV variables of nodemailer was not provided!');
		}
		const transporter = nodemailer.createTransport({
			host: smtpHost,
			port: +smtpPort,
			secure: false,
			auth: {
				user: smtpEmail,
				pass: smtpPassword,
			},
		});
		try {
			const mailOptions = {
				from: smtpEmail,
				to: email,
				html: emailBody,
			};
			const result = await transporter.sendMail(mailOptions);
		} catch (error) {
			console.log('MAILER ERROR', error);
		}
	}
}
