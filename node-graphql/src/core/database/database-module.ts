import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

export { DatabaseUrl } from './database.providers';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule { }