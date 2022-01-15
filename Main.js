const Electron = require('electron');
const { app, BrowserWindow } = require('electron');
const create = require('prompt-sync');

const {Storage} = require('./file-system/file-system')
const fileSystem = new Storage({strorageFileName: "projects"});

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1920,
        height: 1080
    });
  
    // win.loadFile('index.html') add the loadef file later
}

const Initialize = () => {

    createWindow();
    
}


app.whenReady().then(async () => {
    let ERROR = false;

    await fileSystem.Initialize().catch(e => { ERROR = true; });

    // START THE APP IF THERE WASN'T ANY ERRORS
    if(!ERROR){ Initialize(); }

});

