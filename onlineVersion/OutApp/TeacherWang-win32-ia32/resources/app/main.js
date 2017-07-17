const electron = require('electron')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

//主进程
const ipc = require('electron').ipcMain;

app.on('ready',function(){
    var mainWindow = new BrowserWindow({
        width: 420,
        height: 380,
        // width: 800,
        // height: 600,
        resizable: false,
        // frame: false
    })
    mainWindow.loadURL('file://' + __dirname + '/index.html') //主窗口

    // mainWindow.openDevTools();



    ipc.on('zqz-show',function() {
        mainWindow.setSize(800,600);
        mainWindow.setResizable(true);
        mainWindow.maximize();
        // mainWindow.loadURL('file://' + __dirname + '/presWindow.html') //新窗口
    })

    ipc.on('hide-pres',function() {
        presWindow.hide()
    })
})