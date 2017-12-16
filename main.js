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

  // mainWindow[0].webContents.openDevTools()

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
      .ChartPanel_chart-panel_2l4tM {
        height: 100% !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
      }

      .Trade_main-content_33i1w {
        margin-left: 0;
      }

      .UserPanel_user-panel_W_gry,
      .AccountPanel_account-panel_2u2aK,
      .Sidebar_sidebar_3X-DF,
      .StatusBanner_status-view_2rGRs,
      .PanelHeader_panel-header_18Etw
      {
        display: none !important;
      }
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