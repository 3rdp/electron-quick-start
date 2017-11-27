const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {Menu, ipcMain} = electron

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let addWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on("close", function() {
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

  // Open the DevTools.
  // if (process.env.NODE_ENV != "production") mainWindow.webContents.openDevTools()
}

function createAddWindow() {
  addWindow = new BrowserWindow({width: 300, height: 200})
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  // Garbage collection handle
  addWindow.on("close", function() {
    addWindow = null;
  })

  ipcMain.on("item.add", function(e, item) {
    console.log(item)
    mainWindow.webContents.send("item.add", item)
    addWindow.close()
  })
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

}

const mainMenuTemplate = [
  {
    label: "File", 
    submenu: [
      {
        label: "Add Item", 
        click(){
          createAddWindow()
        }
      }, {
        label: "Clear Items", 
        click(){
          mainWindow.webContents.send("item.clear")
        }
      }, {
        label: "Quit", 
        accelerator: "Ctrl+Q",
        click(){
          app.quit()
        }
      }]
  }]

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

if (process.env.NODE_ENV != "production") {
  mainMenuTemplate.push({
    label: "DevTools", 
    accelerator: "F12",
    click(item, focusedWindow){
      focusedWindow.toggleDevTools()
    }
  }, {
    accelerator: "F5",
    role: "reload"
  })
}
