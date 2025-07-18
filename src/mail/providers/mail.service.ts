import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';

import { User } from '../../users/user.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {
    void this.verifyTransporter();
  }

  private async verifyTransporter() {
    try {
      const transporter = this.mailerService['transporter'] as Transporter;
      if (transporter && typeof transporter.verify === 'function') {
        await transporter.verify();
        this.logger.log('✅ Mailer transporter is ready');
      } else {
        this.logger.warn('⚠️ Could not access transporter for verification');
      }
    } catch (err) {
      this.logger.error(
        '❌ Mailer transporter failed to initialize',
        err.stack,
      );
    }
  }

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
      throw new BadRequestException(error || 'Failed to send welcome email');
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
      throw new BadRequestException(
        error || 'Failed to send password reset email',
      );
    }
  }
}
