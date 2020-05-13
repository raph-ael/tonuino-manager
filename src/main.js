const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const { dialog } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function sendWindowMessage(targetWindow, message, payload) {
  if(typeof targetWindow === 'undefined') {
    console.log('Target window does not exist');
    return;
  }
  targetWindow.webContents.send(message, payload);
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  //mainWindow.webContents.openDevTools();

  const workerWindow = new BrowserWindow({
    show: true,
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  workerWindow.webContents.openDevTools();

  workerWindow.loadURL(WORKER_WINDOW_WEBPACK_ENTRY);

  ipcMain.on('command-from-window', (event, arg) => {
    sendWindowMessage(workerWindow, 'command-from-window', arg);
  });

  ipcMain.on('answer-from-worker', (event, arg) => {
    sendWindowMessage(mainWindow, 'answer-from-worker', arg);
  });

  /*
   * Main Window Actions
   */
  ipcMain.on('mainwindow-action', (event, action) => {

    switch (action) {

      case 'close':
        app.exit(0);
        break;

      case 'minimize':
        mainWindow.minimize();
        break;

      case 'maximize':
        if(mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        }
        else {
          mainWindow.maximize();
        }

        break;

    }

  });

  /*
   * mp3 chooser dialog
   */
  ipcMain.on('open-mp3-chooser', async () => {
    let files = await dialog.showOpenDialogSync(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'MP3 Dateien',
        extensions: ['mp3']
      }],
      buttonLabel: 'Kopieren'
    });
    if(files !== undefined) {
      mainWindow.webContents.send('mp3s-choosed', files);
    }

  });

  /*
   * Status Meldungen
   */
  ipcMain.on('status-message', async (event, arg) => {

    mainWindow.webContents.send('status-message', arg);

  });
};

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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
