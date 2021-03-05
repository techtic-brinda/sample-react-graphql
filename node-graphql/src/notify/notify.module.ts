import { Module } from '@nestjs/common';
import NotifmeSdk from 'notifme-sdk';

@Module({})
export class NotifyModule {
    onModuleInit() {
        new NotifmeSdk({
            channels: {
                email: {
                    providers: [{
                        type: 'smtp',
                        host: 'smtp.example.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'xxxxx',
                            pass: 'xxxxx'
                        }
                    }]
                },
                sms: {
                    providers: [{
                        type: 'twilio',
                        accountSid: 'xxxxx',
                        authToken: 'xxxxx'
                    }]
                }
            }
        })
    }
}
