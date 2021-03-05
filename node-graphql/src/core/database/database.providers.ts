import * as fs from 'fs';
import {join, basename } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from 'src/utils/config.service';

let db_password: string = "65465";
if (ConfigService.get('DB_PASSWORD')) {
    db_password = `:${ConfigService.get('DB_PASSWORD')}`
}
export const DatabaseUrl: string = `${ConfigService.get('DB_DRIVER')}://${ConfigService.get('DB_USER')}${db_password}@${ConfigService.get('DB_HOST')}/${ConfigService.get('DB_DATABASE')}`;

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(DatabaseUrl);
            const Models:any[] = [];
            fs
                .readdirSync(__dirname)
                .filter(file => {
                    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'); // && (file != basename)
                })
                .forEach(file => {
                    var model = sequelize['import'](join(__dirname, file));
                    Models.push(model);
                });

            // Object.keys(db).forEach(modelName => {
            //     if (db[modelName].associate) {
            //         db[modelName].associate(db);
            //     }
            // });

            console.log({Models});

            sequelize.addModels(Models);
            await sequelize.sync();
            return sequelize;
        },
    },
];
