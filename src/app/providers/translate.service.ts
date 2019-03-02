import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, retry, tap} from 'rxjs/operators';
import {params} from '../util';

const crypto = require('crypto');
const md5 = crypto.createHash('md5');

const headers = {
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest'
};

const token = 'b33bf8c58706155663d1ad5dba4192dc';

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
export class TranslateService {

  constructor(private http: HttpClient) {
  }

  youdao(text) {
    const payload = {
      i: text,
      doctype: 'json',
      jsonversion: ''
    };
    return this.http.post('http://fanyi.youdao.com/translate', params(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      retry(2),
      map((res: any) => res.translateResult[0][0].tgt)
    );
  }

  sougou(text) {
    const from = 'auto';
    const to = 'zh-CHS';
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

    return this.http.post('https://fanyi.sogou.com/reventondc/translate', payload, {headers}).pipe(
      tap((res: any) => {
        if (!res.isHasOxford) return {isHasOxford: res.isHasOxford, result: res.translate.dit};

        const {phonetic} = res.dictionary.content[0];
        const dicType = res.dictionary.dicType;
        const dict = [];

        phonetic.map(e => {
          e.name = e.type;
          e.value = e.text;
          e.ttsURI = e.filename;
        });

        res.dictionary.content.forEach(e => {
          dict[e.word] = e.usual.map(u => u.pos + ' ' + u.values[0]);
        });

        console.log(dict);

        return {phonetic, dicType, dict, result: res.translate.dit, isHasOxford: res.isHasOxford};
      })
    );

    // return fetch('https://fanyi.sogou.com/reventondc/translate', {
    //   method: 'POST',
    //   headers,
    //   body: params(payload)
    // }).then(async res => {
    //   if (res.ok) return res.json();
    //
    //   // 如果翻译失败,尝试从js源码中获取token
    //   let script = await fetch('https://fanyi.sogou.com/', {headers});
    //   // @ts-ignore
    //   let m = /js\/app\.([^.]+)/.exec(script);
    //   if (!m) throw res;
    //   script = await fetch('https://dlweb.sogoucdn.com/translate/pc/static/js/app.' + m[1] + '.js', {headers});
    //   // @ts-ignore
    //   m = /""\+\w\+\w\+\w\+"(\w{32})"/.exec(script);
    //   if (!m) throw res;
    //   if (token === m[1]) throw res;
    //   token = m[1];
    //   return this.sougou(text);
    // }).then(res => {
    //   if (!res.isHasOxford) return {isHasOxford: res.isHasOxford, result: res.translate.dit};
    //
    //   const {phonetic} = res.dictionary.content[0];
    //   const dicType = res.dictionary.dicType;
    //   const dict = [];
    //
    //   phonetic.map(e => {
    //     e.name = e.type;
    //     e.value = e.text;
    //     e.ttsURI = e.filename;
    //   });
    //
    //   res.dictionary.content.forEach(e => {
    //     dict[e.word] = e.usual.map(u => u.pos + ' ' + u.values[0]);
    //   });
    //
    //   console.log(dict);
    //
    //   return {phonetic, dicType, dict, result: res.translate.dit, isHasOxford: res.isHasOxford};
    // });
  }
}
