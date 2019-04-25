import {Injectable} from '@angular/core';
import fileSchema, {FileCollection, FileDocument, FileDocumentType} from '../schemas/file.schema';
import historySchema, {HistoryCollection, HistoryDocument, HistoryDocumentType} from '../schemas/history.schema';
import glossarySchema, {GlossaryCollection} from '../schemas/glossary.schema';
import textbookSchema, {TextbookCollection} from '../schemas/textbook.schema';
import recordSchema, {RecordCollection} from '../schemas/record.schema';

import {RxDatabase} from 'rxdb';
import RxDB from 'rxdb/plugins/core';
import RxDBValidateModule from 'rxdb/plugins/validate';
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election';
import RxDBReplicationModule from 'rxdb/plugins/replication';
import UpdatePlugin from 'rxdb/plugins/update';

import * as PouchdbAdapterHttp from 'pouchdb-adapter-http';
import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';

// if (ENV === 'development') {
//   // in dev-mode we show full error-messages
//   RxDB.plugin(RxDBErrorMessagesModule);
//
//   // schema-checks should be used in dev-mode only
//   RxDB.plugin(RxDBSchemaCheckModule);
// }

RxDB.plugin(RxDBValidateModule);
RxDB.plugin(RxDBLeaderElectionModule);
RxDB.plugin(RxDBReplicationModule);
RxDB.plugin(PouchdbAdapterHttp);
RxDB.plugin(PouchdbAdapterIdb);
RxDB.plugin(UpdatePlugin);

interface Collections {
  file: FileCollection;
  history: HistoryCollection;
  glossary: GlossaryCollection;
  textbook: TextbookCollection;
  record: RecordCollection;
}

type Database = RxDatabase<Collections>;

const collections = [
  {
    name: 'file',
    schema: fileSchema
  }, {
    name: 'history',
    schema: historySchema
  }, {
    name: 'glossary',
    schema: glossarySchema
  }, {
    name: 'textbook',
    schema: textbookSchema
  }, {
    name: 'record',
    schema: recordSchema
  }
];

// let doSync = true;
// if (window.location.hash === '#nosync') doSync = false;

async function _create(): Promise<Database> {
  const db = await RxDB.create<Collections>({
    name: 'files',
    adapter: 'idb',
    queryChangeDetection: false
  });

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

@Injectable()
export class AppInitService {
  public DB_INSTANCE;

  constructor() {
  }

  async Init() {
    this.DB_INSTANCE = await _create();
  }
}
