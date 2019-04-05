import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, retry, tap} from 'rxjs/operators';
import {params} from '../util';

const crypto = require('crypto');

const headers = {
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest'
};

const uuid = () => {
  let t, e;
  let n = '';
  for (t = 0; t < 32; t++) {
    e = (16 * Math.random()) | 0;
    if (t === 8 || t === 12 || t === 16 || t === 20) n += '-';
    (n += (t === 12 ? 4 : t === 16 ? (3 & e) | 8 : e).toString(16));
  }
  return n;
};

@Injectable({
  providedIn: 'root'
})
export class ResultApiService {

  constructor(private http: HttpClient) {
  }

  youdao(word) {
    return this.http.get('http://dict.youdao.com/jsonapi?' + params({
      q: word,
      dicts: {
        'count': 99,
        'dicts': [['ec', 'exam_dict', 'collins']]
      },
      client: 'mobile',
      jsonversion: 2
    })).pipe(
      retry(2),
      map((res: any) => {
          let wordForm = [];
          let collins: any = false;
          const base = res.ec.word[0].trs.map(e => e.tr[0].l.i[0]);
          if (res.collins) {
            const entries = res.collins.collins_entries[0];
            collins = {
              star: entries.star,
              entry: entries.entries.entry
            };
          }

          try {
            wordForm = collins.basic_entries.basic_entry[0].wordforms.wordform.map(e => e.word);
          } catch (e) {
          }

          return {
            base,
            wordForm,
            type: res.ec.exam_type,
            collins
          };
        }
      ));
  }

  sougoTokenInit() {
    if (!localStorage.getItem('sougoToken')) this.updateSougoToken();
  }

  updateSougoToken() {
    return this.http.get('https://fanyi.sogou.com', {responseType: 'text'}).pipe(
      tap(html => {
          this.http.get(`https://dlweb.sogoucdn.com/translate/pc/static/js/app.${/js\/app\.([^.]+)/.exec(html)[1]}.js`,
            {responseType: 'text'}).subscribe(js => {
            const m = /""\+\w\+\w\+\w\+"(\w{32})"/.exec(js);
            if (!m) throw new Error('获取token出错');
            localStorage.setItem('sougoToken', m[1]);
          });
        }
      ));
  }

  sougou(text) {
    const from = 'auto';
    const to = 'zh-CHS';
    const md5 = crypto.createHash('md5');
    const token = localStorage.getItem('sougoToken');
    const s = md5.update(from + to + text + token).digest('hex');
    text = encodeURIComponent(text).replace(/%20/g, '+');

    const payload = {
      from,
      to,
      client: 'pc',
      fr: 'browser_pc',
      text,
      useDetect: 'on',
      useDetectResult: 'on',
      needQc: 1,
      uuid: uuid(),
      oxford: 'on',
      pid: 'sogou-dict-vr',
      isReturnSugg: 'on',
      s
    };

    return this.http.post('https://fanyi.sogou.com/reventondc/translate', params(payload), {headers}).pipe(
      retry(2),
      map((res: any) => {
        if (!res.dictionary) this.updateSougoToken().subscribe(() => res = this.sougou(text));
        if (!res.isHasOxford) return {isHasOxford: res.isHasOxford, result: res.translate.dit};
        return {
          oxford: res.dictionary.content[0]
        };
      })
    );
  }
}

