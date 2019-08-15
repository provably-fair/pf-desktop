'use strict'
const { app, BrowserWindow } = require('electron');
const redis = require('redis');
const randomInt = require('random-int');
const uuidv4 = require('uuid/v4')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let client;
let randomNumber;
let clientSeed;
let serverSeed;
let clientGuess;
let provablyFair;

const createClient = () => {
  if (client == undefined){
    console.log('✔ Creating Redis Client');
    client  = redis.createClient({
      host: 'redis-15325.c8.us-east-1-4.ec2.cloud.redislabs.com',
      port: 6379,
      password: 'dljHHsea1nKJbn9IbNkANSHlLCAL8tm9',
      db: 'upscale'
   })
   provablyFair = require('provably-fair')(client);
   console.log('✔ Redis Client Created');
  }
  client.on('error', (err) => {
    console.log(err);
  })
}


const challenge = () => {
  provablyFair.createAndChallenge({
    serverSeed,
    clientSeed,
    expiresIn: 60 * 60,
    clientGuess,
    customResult: randoMizeNumber,
    customValidation: validation
  }, (err, valid, bet) => {
    if (err){
      console.log('There seems to be an error');
    }
    if (valid){
      console.log('Bet is valid');
    }
    if (bet){
      console.log('Bet');
    }
  })
}


const randoMizeNumber = () => {
  randomNumber = Math.floor((randomInt(10) * 10) + 1);
}

const validation = (guess,result) => {
  return guess == result;
}

const serverSeedHash = () => {
  console.log('✔ Generating Server Seed');
  serverSeed = provablyFair.generateServerSeedHash();
  console.log('✔ Server Seed Generated');

}

const generateClientSeed = () => {
  console.log('✔ Generating client seed');
  clientSeed = uuidv4();
  console.log('✔ Client Seed Generated');
}


const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });


  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  createClient();
  serverSeedHash();

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
    client.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
