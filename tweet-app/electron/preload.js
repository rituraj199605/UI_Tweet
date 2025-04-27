// tweet-app/electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    // For persistent storage
    tweetStorage: {
      getTweets: () => ipcRenderer.invoke('getTweets'),
      saveTweets: (tweets) => ipcRenderer.invoke('saveTweets', tweets),
      deleteTweet: (tweetId) => ipcRenderer.invoke('deleteTweet', tweetId)
    }
    // Note: We've removed the fileSystem API that used electron.remote
    // If you need file system access, it should be implemented in the main process
  }
);