import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '../../../utils/config.service';
import { join } from 'path';


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: `smtps://${ConfigService.get(
                    'MAIL_USERNAME',
                )}:${ConfigService.get('MAIL_PASSWORD')}@${ConfigService.get(
                    'MAIL_HOST',
                )}`,
                defaults: {
                    from: `"${ConfigService.get('MAIL_FROM_NAME')}" <${ConfigService.get(
                        'MAIL_FROM_EMAIL',
                    )}>`,
                }
            }),
        }),
    ],
    providers: [
    ]
})
export class MailModule { }
