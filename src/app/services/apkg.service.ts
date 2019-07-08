import {Injectable} from '@angular/core';
import {app} from 'electron';
import {createConnection, getRepository} from 'typeorm';
import {Cards} from '../entity/cards';

const zip = require('cross-zip');
const COLLECTION = 'collection.anki2';

@Injectable({
  providedIn: 'root'
})
export class ApkgService {
  static apkgPath = app.getAppPath() + '/apkg';
  connection;
  userRepository = getRepository(Cards);

  constructor() {
    this.connectSqlite(ApkgService.apkgPath).then(connection => this.connection = connection);
  }

  static set unzip(fileName: string) {
    zip.unzipSync(fileName);
  }

  async connectSqlite(database) {
    return await createConnection({
      type: 'sqlite',
      database
    });
  }

  async findAll(query): Promise<{ data: Cards[], count: number }> {
    const take = query.take || 20;
    const skip = query.skip || 0;

    const [cards, count] = await this.userRepository.findAndCount({
        where: {name: ''},
        take: take,
        skip: skip
      }
    );

    return {
      data: cards,
      count
    };
  }
}
