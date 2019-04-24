import {Injectable} from '@angular/core';
import fileSchema, {FileCollection, FileDocument, FileDocumentType} from '../schemas/file.schema';
import historySchema, {HistoryCollection, HistoryDocument, HistoryDocumentType} from '../schemas/history.schema';
import glossarySchema, {GlossaryCollection} from '../schemas/glossary.schema';
import textbookSchema, {TextbookCollection} from '../schemas/textbook.schema';
import recordSchema, {RecordCollection} from '../schemas/record.schema';
import RxDB from 'rxdb/plugins/core';
import RxDBValidateModule from 'rxdb/plugins/validate';
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election';
import RxDBReplicationModule from 'rxdb/plugins/replication';
// always needed for replication with the node-server
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http';
import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';
import {RxDatabase} from 'rxdb';
import config from '../../../config';
import {MessageService} from './message.service';

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

let DB_INSTANCE: Database;

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {
  DB_INSTANCE = await _create();
}

@Injectable()
export class DatabaseService {
  get db(): Database {
    return DB_INSTANCE;
  }

  constructor(private message: MessageService) {
  }

  private syncURL() {
    return `http://${config.domain}/db/userdb-${Buffer.from(this.message.loginState.getValue(), 'utf8').toString('hex')}`;
  }

  async creatTextbookDB(name) {
    return this.db.textbook.sync({
      remote: `http://${config.domain}/db/textbook-${name}`,
      direction: {
        push: false
      },
      options: {
        live: false,
        retry: true
      }
    }).complete$;
  }

  findAllFile() {
    return this.db.file.find().where('use').gt(0).exec().then(
      res => res.map(e => e.toJSON()));
  }

  async getHistory() {
    return await this.db.history.find().limit(15).exec().then(
      res => res.map(e => e.toJSON()));
  }

  async inGlossary(word: string) {
    return await this.db.glossary.findOne({word: {$eq: word}}).exec().then(res => !!res);
  }

  async updateGlossary(word: string, like: boolean, base: Array<string>) {
    const query = this.db.glossary.findOne({word: {$eq: word}});
    if (like) {
      await this.db.glossary.upsert({word, definition: base.join(' '), addTime: new Date().toLocaleString()});
    } else {
      await query.remove();
    }
  }

  async getGlossary(skip: number = 0) {
    return await this.db.glossary.find().exec().then(
      res => res.map(e => e.toJSON()));
  }

  async getTextbook(limit, gte = -1, lte = 5) {
    if (gte > lte) return;
    let find = this.db.textbook.find().where('state');
    find = gte === lte ? find.eq(gte) : find.lte(lte).gte(gte);
    // if (gte * lte !== -5) find = find.lte(lte).gte(gte);
    if (limit) find = find.limit(limit);
    return await find.exec().then(
      res => res.map(e => e.toJSON()));
  }

  review(word: string, state: number) {
    this.db.textbook.find().where('name').eq(word).update({state});
  }

  syncTextbook(textbook) {
    this.db.textbook.sync({
      remote: this.syncURL() + '-' + textbook,
      waitForLeadership: true,
      options: {
        live: true,
        retry: true
      },
      query: this.db.textbook.find().where('state').gte(0)
    });
  }

  setSync() {
    const sync = {
      remote: this.syncURL(),
      waitForLeadership: true,   // (optional) [default=true] to save performance, the sync starts on leader-instance only
      options: {                 // sync-options (optional) from https://pouchdb.com/api.html#replication
        live: true,
        retry: true
      }
    };

    this.db.history.sync(sync);
    // this.db.glossary.sync(sync);
  }
}
