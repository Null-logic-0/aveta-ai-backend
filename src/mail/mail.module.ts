import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('appConfig.environment') === 'production';
        return {
          transport: isProd
            ? {
                host: config.get('appConfig.resendHost'),
                port: config.get('appConfig.resendPort'),
                secure: false,
                auth: {
                  user: config.get('appConfig.resendUser'),
                  pass: config.get('appConfig.resendPassword'),
                },
              }
            : {
                host: config.get('appConfig.mailHost'),
                port: Number(config.get('appConfig.mailPort')),
                auth: {
                  user: config.get('appConfig.smtpUserName'),
                  pass: config.get('appConfig.smtpPassword'),
                },
              },
          defaults: {
            from: `"Aveta AI" <no-reply@aveta.com>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: { strict: false },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
