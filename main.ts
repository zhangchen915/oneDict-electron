import {app, BrowserWindow, Menu, ipcMain} from 'electron';
import * as path from 'path';
import * as url from 'url';
const contextMenu = require('electron-context-menu');

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

  if (!app.isPackaged) win.webContents.openDevTools();

  win.on('closed', () => win = null);
}

try {
  // remove so we can register each time as we run the app.
  app.removeAsDefaultProtocolClient('onedict');

  if (!app.isPackaged && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient('onedict', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('onedict');
  }

  dictionary((err, dict) => {
    if (err) throw err;
    this.spell = nspell(dict);
  });
  ipcMain.on('getSpell', (event, word) => {
    event.returnValue = Object.assign(this.spell.spell(word), {
      suggest: this.spell.suggest(word)
    });
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow();
  });
} catch (e) {
  throw e;
}
