const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow = new Array(4)

function createWindow (URL = '', ID = 0) {

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize


  const customWidth = Math.round(width/2)
  const customHeight = Math.round(height/2)

  mainWindow[ID] = new BrowserWindow({
    width: customWidth,
    height: customHeight,
    frame: false,
    resizable: false
  })

  switch(ID) {
    case 0: 
      mainWindow[ID].setPosition(0,0)
      break
    case 1: 
      mainWindow[ID].setPosition(0,customHeight)
      break
    case 2: 
      mainWindow[ID].setPosition(customWidth,0)
      break
    case 3: 
      mainWindow[ID].setPosition(customWidth,customHeight)
      break
  }


  mainWindow[ID].loadURL(URL)

  // mainWindow.webContents.openDevTools()

  mainWindow[ID].on('closed', function () {
    mainWindow[ID] = null
  })

  mainWindow[ID].webContents.on('dom-ready', function() {

    mainWindow[ID].webContents.insertCSS(`
      html {
        overflow: scroll;
        overflow-x: hidden;
      }
      ::-webkit-scrollbar {
          width: 0px;  /* remove scrollbar space */
          background: transparent;  /* optional: just make scrollbar invisible */
      }
      /* optional: show position indicator in red */
      ::-webkit-scrollbar-thumb {
          background: #FF0000;
      }
    `)

    mainWindow[ID].webContents.executeJavaScript(`
      let startTimer = setInterval(function() {
        let topBar = document.getElementsByClassName("StatusBanner_status-view_2rGRs")[0]
        if (typeof topBar === 'undefined') {
          return
        } else {
          clearInterval(startTimer)
        }
        topBar.parentNode.removeChild(topBar)

        let timer = setInterval(function() {
          let sideBar = document.getElementsByClassName("Sidebar_sidebar_3X-DF")[0]
          if (typeof sideBar !== 'undefined') {
            sideBar.parentNode.removeChild(sideBar)
            document.getElementsByClassName("Trade_main-content_33i1w")[0].style.marginLeft = 0
            
            let profile = document.getElementsByClassName("AccountPanel_account-panel_2u2aK")[0]
            profile.parentNode.removeChild(profile)
            
            let userPanel = document.getElementsByClassName("UserPanel_user-panel_W_gry")[0]
            userPanel.parentNode.removeChild(userPanel)
            
            clearInterval(timer)
          }
        }, 100)
      }, 100)
    `)
  })
}

app.on('ready', function() {
  createWindow('https://www.gdax.com/trade/BTC-EUR', 0)
  createWindow('https://www.gdax.com/trade/ETH-EUR', 1)
  createWindow('https://www.gdax.com/trade/ETH-BTC', 2)
  createWindow('https://www.gdax.com/trade/LTC-BTC', 3)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})