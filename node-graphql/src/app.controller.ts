import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/admin/*')
  admin() {
    console.log('AppController admin');
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(process.cwd(), '../admin/build/index.html'),
        'utf8',
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
      );
    });
  }
}
