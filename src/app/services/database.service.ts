import {Injectable} from '@angular/core';
import fileSchema, {FileDocument, FileDocumentType, FileCollection} from '../schemas/file.schema';
import historySchema, {HistoryCollection, HistoryDocument, HistoryDocumentType} from '../schemas/history.schema';
import glossarySchema, {GlossaryCollection, GlossaryDocument, GlossaryDocumentType} from '../schemas/glossary.schema';
import RxDB from 'rxdb/plugins/core';

// import modules
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check';
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages';

// if (ENV === 'development') {
//   // in dev-mode we show full error-messages
//   RxDB.plugin(RxDBErrorMessagesModule);
//
//   // schema-checks should be used in dev-mode only
//   RxDB.plugin(RxDBSchemaCheckModule);
// }

import RxDBValidateModule from 'rxdb/plugins/validate';

RxDB.plugin(RxDBValidateModule);

import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election';

RxDB.plugin(RxDBLeaderElectionModule);

import RxDBReplicationModule from 'rxdb/plugins/replication';

RxDB.plugin(RxDBReplicationModule);
// always needed for replication with the node-server
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http';

RxDB.plugin(PouchdbAdapterHttp);

import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';
import {RxDatabase} from 'rxdb';

RxDB.plugin(PouchdbAdapterIdb);

interface Collections {
  file: FileCollection;
  history: HistoryCollection;
  glossary: GlossaryCollection;
}

type Database = RxDatabase<Collections>;

const collections = [
  {
    name: 'file',
    schema: fileSchema,
    sync: false
  }, {
    name: 'history',
    schema: historySchema,
    sync: false
  }, {
    name: 'glossary',
    schema: glossarySchema,
    sync: false
  }
];

console.log('hostname: ' + window.location.hostname);
// const syncURL = 'http://' + window.location.hostname + ':10101/';

// let doSync = true;
// if (window.location.hash === '#nosync') doSync = false;

async function _create(): Promise<Database> {
  console.log('DatabaseService: creating database..');
  const db = await RxDB.create<Collections>({
    name: 'files',
    adapter: 'idb',
    queryChangeDetection: false
  });
  console.log('DatabaseService: created database');
  (window as any)['db'] = db; // write to window for debugging

  // show leadership in title
  db.waitForLeadership()
    .then(() => {
      console.log('isLeader now');
    });

  // create collections
  console.log('DatabaseService: create collections');
  await Promise.all(collections.map(colData => db.collection(colData)));

  // hooks
  console.log('DatabaseService: add hooks');
  db.collections.file.preInsert((docObj: FileDocumentType) => {
    const name = docObj.name;
    return db.collections.file.findOne({name}).exec()
      .then((has: FileDocument | null) => {
        if (has != null) throw new Error('file already there');
        return db;
      });
  }, true);

  db.collections.history.preInsert((docObj: HistoryDocumentType) => {
    const word = docObj.word;
    return db.collections.file.findOne({path: word}).exec()
      .then((has: HistoryDocument | null) => {
        if (has != null) db.collections.file.delete(has);
      });
  }, true);

  // sync with server
  // console.log('DatabaseService: sync');
  // await db.file.sync({
  //   remote: syncURL + '/file'
  // });

  db.collections.file.find().exec().then(res => {
    if (!res.length) {
      db.collections.file.insert({
        name: '科林斯词典',
        web: true,
        use: 1
      });
      db.collections.file.insert({
        name: '牛津词典',
        web: true,
        use: 2
      });
    }
  });

  return db;
}

let DB_INSTANCE: Database;

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {
  console.log('initDatabase');
  DB_INSTANCE = await _create();
}

@Injectable()
export class DatabaseService {
  get db(): Database {
    return DB_INSTANCE;
  }

  findAllFile() {
    return this.db.file.find().where('use').gt(0).exec().then(
      res => res.map(e => e.toJSON()));
  }

  // .sort({'searchTime': 'desc'})
  async getHistory() {
    return await this.db.history.find().limit(15).exec().then(
      res => res.map(e => e.toJSON()));
  }

  async inGlossary(word: string) {
    return await this.db.glossary.findOne({word: {$eq: word}}).exec().then(res => !!res);
  }

  async updateGlossary(word, like) {
    const query = this.db.glossary.findOne({word: {$eq: word}});
    if (like) {
      await query.exec().then(async res => {

        if (!!res) {
          await query.update({word});
        } else {
          await this.db.glossary.insert({
            word, addTime: new Date().toLocaleString(),
          });
        }
      });
    } else {
      await query.remove();
    }
  }

  async getGlossary(skip: number = 0) {
    return await this.db.history.find().skip(skip).limit(15).exec().then(
      res => res.map(e => e.toJSON()));
  }
}
