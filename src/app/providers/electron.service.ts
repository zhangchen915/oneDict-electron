import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame, remote, clipboard, shell} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  shell: typeof shell;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.shell = window.require('electron').shell;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  isElectron = () => window && window.process && window.process.type;

  clipboardListen(watchDelay = 1000) {
    let lastText = clipboard.readText();
    const intervalId = setInterval(() => {
      const text = clipboard.readText();
      if (text && text !== lastText) {
        lastText = text;
        this.remote.getCurrentWindow().show();
      }
    }, watchDelay);

    return {
      stop: () => clearInterval(intervalId)
    };
  }
}
