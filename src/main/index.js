/* globals INCLUDE_RESOURCES_PATH */
import { app } from 'electron';
const AutoLaunch = require('auto-launch');

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined;
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH;
// eslint-disable-next-line no-undef,no-console
if (__resources === undefined) console.error('[Main-process]: Resources path is undefined');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  // app.setAppUserModelId('ru.intelrug.sketchdaily');
  app.setAppUserModelId(process.execPath);

  const autoLaunch = new AutoLaunch({
    name: 'Sketch Daily',
    path: app.getPath('exe'),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });
});

// Load here all startup windows
require('./mainWindow');
