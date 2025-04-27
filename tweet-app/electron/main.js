// tweet-app/electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// We'll initialize the store after importing it dynamically
let store;

// Handle creating/removing shortcuts on Windows when installing/uninstalling
let handleSquirrelEvents = false;
try {
  const electronSquirrelStartup = require('electron-squirrel-startup');
  handleSquirrelEvents = electronSquirrelStartup;
} catch (e) {
  // electron-squirrel-startup module not found, ignore
  console.log("electron-squirrel-startup not found, skipping Windows installer events");
}

if (handleSquirrelEvents) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // Security: disable Node.js integration in renderer
      contextIsolation: true, // Security: enable context isolation
      preload: path.join(__dirname, 'preload.js') // Use a preload script
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  // In production, load the bundled app
  // In development, load from the dev server
  const startUrl = process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  // Dynamically import electron-store (ES Module)
  const { default: Store } = await import('electron-store');
  
  // Initialize store for persistent storage
  store = new Store({
    name: 'organic-tweets',
    defaults: {
      savedTweets: []
    }
  });

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set up IPC (Inter-Process Communication) handlers for data persistence
ipcMain.handle('getTweets', async () => {
  if (!store) {
    const { default: Store } = await import('electron-store');
    store = new Store({
      name: 'organic-tweets',
      defaults: {
        savedTweets: []
      }
    });
  }
  return store.get('savedTweets');
});

ipcMain.handle('saveTweets', async (event, tweets) => {
  if (!store) {
    const { default: Store } = await import('electron-store');
    store = new Store({
      name: 'organic-tweets',
      defaults: {
        savedTweets: []
      }
    });
  }
  store.set('savedTweets', tweets);
  return true;
});

ipcMain.handle('deleteTweet', async (event, tweetId) => {
  if (!store) {
    const { default: Store } = await import('electron-store');
    store = new Store({
      name: 'organic-tweets',
      defaults: {
        savedTweets: []
      }
    });
  }
  const tweets = store.get('savedTweets');
  const updatedTweets = tweets.filter(tweet => tweet.id !== tweetId);
  store.set('savedTweets', updatedTweets);
  return updatedTweets;
});