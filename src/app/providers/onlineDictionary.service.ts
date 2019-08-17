import {Injectable} from '@angular/core';
import {ElectronService} from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineDictionaryService {
  private onlineUrlList = {
    Baidu: s => `https://fanyi.baidu.com/#en/zh/${s}`,
    Youdao: s => `https://www.youdao.com/w/${s}`,
    Sougou: s => `https://fanyi.sogou.com/#auto/zh-CHS/${s}`,
    Google: s => `https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=${s}`,
    Cambridge: s => `https://dictionary.cambridge.org/dictionary/english/${s}`
  };

  public onlineList: Array<string> = Object.keys(this.onlineUrlList);

  constructor(private electron: ElectronService) {
  }

  public onlineSearchJump(name: string, word: string) {
    this.electron.shell.openExternal(this.onlineUrlList[name](word));
  }

}
