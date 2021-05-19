import path from 'path';
import Store from 'electron-store';
import BrowserWinHandler from './BrowserWinHandler';
const isDev = process.env.NODE_ENV === 'development';

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html');
const DEV_SERVER_URL = process.env.DEV_SERVER_URL;

const store = new Store();

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function windowStateKeeper(windowName) {
  let debounceTimeout;
  let window;
  let windowState = {
    x: undefined,
    y: undefined,
    width: 800,
    height: 640,
  };

  function setBounds() {
    // Restore from appConfig
    if (store.has(`windowState.${windowName}`)) {
      windowState = store.get(`windowState.${windowName}`);
      return;
    }
    // Default
    windowState = {
      x: undefined,
      y: undefined,
      width: 800,
      height: 640,
    };
  }

  function saveState() {
    if (window) {
      if (!window.isMaximized()) {
        windowState = window.getBounds();
      }
      windowState.isMaximized = window.isMaximized();
      store.set(`windowState.${windowName}`, windowState);
    }
  }

  function track(win) {
    ['resize', 'move'].forEach((event) => {
      win.on(event, () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          window = win;
          saveState();
        }, 200);
      });
    });
    win.on('close', saveState);
  }

  setBounds();

  return {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track,
  };
}

const mainWindowStateKeeper = windowStateKeeper('main');

const winHandler = new BrowserWinHandler({
  minWidth: 800,
  minHeight: 640,
  x: mainWindowStateKeeper.x,
  y: mainWindowStateKeeper.y,
  width: mainWindowStateKeeper.width,
  height: mainWindowStateKeeper.height,
  isMaximized: mainWindowStateKeeper.isMaximized,
  frame: false,
  backgroundColor: '#0d0d0d',
});

winHandler.onCreated((browserWindow) => {
  mainWindowStateKeeper.track(browserWindow);
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL);
  else browserWindow.loadFile(INDEX_PATH);
});

export default winHandler;
