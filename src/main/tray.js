import { app, Menu, Tray } from 'electron';
let tray;

const createTray = (browserWindow) => {
  tray = new Tray('E:/downloads/apple.png');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Выход',
      click() {
        app.exit();
      },
    },
  ]);
  tray.setToolTip('Sketch Daily');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    browserWindow.show();
  });
};

export default createTray;
