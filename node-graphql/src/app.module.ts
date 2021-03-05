import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostGraphileModule } from './packages/postgraphile';
import { DatabaseModule, DatabaseUrl } from './core/database/database-module';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { Plugins, CustomSchemaType } from './plugins';
import { resolveUpload } from './utils/resolve-upload';
import { NotifyModule } from './notify/notify.module';
import { resolve } from 'path';
import { MailModule } from './common/modules/mail/mail.module';
import { makePluginHook } from 'postgraphile';
const is_dav = true; // process.env.NODE_ENV !== 'production';
import PgPubsub from '@graphile/pg-pubsub';
const pluginHook = makePluginHook([PgPubsub]);

@Module({
  imports: [
    MailModule,
    DatabaseModule,
    // RenderModule.forRootAsync(
    //   Next({
    //     dev: is_dav,
    //     dir: resolve(process.cwd(), '..', 'nextjs')
    //   }),
    // ),
    PostGraphileModule.forRootAsync({
      useFactory: () => {
        return {
          pluginHook,
          pgConfig: DatabaseUrl,
          ... (is_dav ? {
            watchPg: true,
            showErrorStack: 'json',
            // tslint:disable-next-line: max-line-length
            extendedErrors: ['hint', 'detail', 'errcode'], /*,  'severity','code','hint','position','internalPosition','internalQuery','where','schema','table','column' */
            graphiql: true,
            enhanceGraphiql: true,
            allowExplain() {
              // TODO: customise condition!
              return true;
            },
          } : {
              retryOnInitFail: true,
              extendedErrors: ['errcode'],
              graphiql: false,
              disableQueryLog: true,
            }),
          live: false,
          subscriptions: true,
          playground: true,
          playgroundRoute: '/playground',
          dynamicJson: true,
          setofFunctionsContainNulls: false,
          ignoreRBAC: false,
          ignoreIndexes: true,
          jwtPgTypeIdentifier: 'public.jwt_token',
          jwtSecret: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
          jwtRole: ['user', 'admin'],
          appendPlugins: [
            require('@graphile-contrib/pg-simplify-inflector'),
            require('@graphile/subscriptions-lds').default,
            require('postgraphile-plugin-connection-filter'),
            require('postgraphile-plugin-fulltext-filter'),
            // require("postgraphile-plugin-upload-field"),
            require('postgraphile-plugin-nested-mutations'),
            require('@graphile-contrib/pg-many-to-many'),
            ...Plugins,
          ],
          graphileBuildOptions: {
            connectionFilterRelations: true,
            connectionFilterArrays: true,
            connectionFilterSetofFunctions: true,
            connectionFilterAllowEmptyObjectInput: true,
            uploadFieldDefinitions: [
              {
                match: ({ column }) => column === 'featured_image' || column === 'image',
                resolve: (upload) => {
                  return resolveUpload(upload);
                },
              },
            ],
          },
          enableQueryBatching: true,
          legacyRelations: 'omit',
          pgSettings: async () => {
            return {};
          },
        };
      },
    }),
    NotifyModule,
    // PluginModule
  ],
  controllers: [AppController],
  providers: [
    ...CustomSchemaType,
    AppService,
  ],
})
export class AppModule {

  async onModuleInit() {
    // const httpAdapter = this.httpAdapterHost.httpAdapter;
    // if (!httpAdapter) {
    //   return;
    // }
  }
}
