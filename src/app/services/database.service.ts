import {Injectable} from '@angular/core';

import {
  FileDocument,
  FilesDatabase,
  FilesCollections,
  FileDocumentType
} from '../schemas/file.schema';

import fileSchema from '../schemas/file.schema';
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

RxDB.plugin(PouchdbAdapterIdb);

const collections = [
  {
    name: 'file',
    schema: fileSchema,
    sync: false
  }
];

console.log('hostname: ' + window.location.hostname);
// const syncURL = 'http://' + window.location.hostname + ':10101/';

// let doSync = true;
// if (window.location.hash === '#nosync') doSync = false;

async function _create(): Promise<FilesDatabase> {
  console.log('DatabaseService: creating database..');
  const db = await RxDB.create<FilesCollections>({
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
      document.title = '♛ ' + document.title;
    });

  // create collections
  console.log('DatabaseService: create collections');
  await Promise.all(collections.map(colData => db.collection(colData)));

  // hooks
  console.log('DatabaseService: add hooks');
  db.collections.file.preInsert((docObj: FileDocumentType) => {
    const path = docObj.path;
    return db.collections.file.findOne({path}).exec()
      .then((has: FileDocument | null) => {
        if (has != null) {
          throw new Error('file already there');
        }
        return db;
      });
  }, true);

  // sync with server
  // console.log('DatabaseService: sync');
  // await db.file.sync({
  //   remote: syncURL + '/file'
  // });

  db.collections.file.find().exec().then(res => {
    console.log(res);
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

  console.log();

  return db;
}

let DB_INSTANCE: FilesDatabase;

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
  get db(): FilesDatabase {
    return DB_INSTANCE;
  }
}
