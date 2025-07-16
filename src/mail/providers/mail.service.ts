import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(user: User): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: `Onboarding Team <no-reply@aveta.com>`,
        subject: "Thanks for joining Aveta — Here's what's next ",
        template: './welcome',
        context: {
          name: user.userName,
          email: user.email,
          homeUrl: 'https://aveta.com',
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendPasswordReset(user: User, link: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: `Aveta AI <no-reply@aveta.com>`,
        subject: 'Reset Your Aveta Password',
        template: './reset-password',
        context: {
          name: user.userName,
          link,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
