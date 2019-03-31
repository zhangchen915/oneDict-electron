import {app, BrowserWindow, Menu, ipcMain} from 'electron';
import * as path from 'path';
import * as url from 'url';
import contextMenu from 'electron-context-menu';

const dictionary = require('dictionary-en-us');
const nspell = require('nspell');

contextMenu({
  showSaveImageAs: true,
  showInspectElement: false,
  labels: {
    cut: '剪切',
    copy: '复制',
    paste: '黏贴',
    save: '保存',
    saveImageAs: '图片另存为'
  }
});

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    transparent: true,
    frame: false,
    webPreferences: {
      webSecurity: false
    }
  });

  Menu.setApplicationMenu(null);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {
  dictionary((err, dict) => {
    if (err) throw err;
    this.spell = nspell(dict);
  });
  ipcMain.on('getSpellSuggest', (event, arg) => {
    event.returnValue = this.spell.suggest(arg);
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
