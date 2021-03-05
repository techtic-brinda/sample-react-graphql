import { NestFactory } from '@nestjs/core'; 
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true 
  });

  // const dev = false; //process.env.NODE_ENV !== 'production';
  // const dir = resolve(__dirname, '../../frontend');

  // try{
  //   const react_app = Next({ dev, dir });
  //   const renderer = app.get(RenderModule);
  //   renderer.register(app, react_app, { viewsDir: '' });
  // }catch (e){
  //   console.log("react error", e);
  // }

  app.use(graphqlUploadExpress());

  app.useStaticAssets(join(__dirname, '../../admin/build'), {
    prefix: '/admin'
  });

  app.useStaticAssets(join(__dirname, '../public'), {
    prefix: '/public'
  });
  
  // app.useStaticAssets(join(__dirname, '../../frontend/build'), {
  //   prefix: '/'
  // });

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`Server starting on http://localhost:3000`)
  });

}
bootstrap();
