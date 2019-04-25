import {Injectable} from '@angular/core';
import {AppInitService} from './init.service';
import {MessageService} from './message.service';
import config from '../../../config';

@Injectable()
export class DatabaseService {
  db = this.init.DB_INSTANCE;

  constructor(private message: MessageService,
              private init: AppInitService) {
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
    this.db.textbook.findOne().where('word').eq(word).update({$set: {state}});
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
