const { app, BrowserWindow, session } = require('electron');
const path = require('path');
function create() {
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(perm === 'media'));
  session.defaultSession.setPermissionCheckHandler((wc, perm) => perm === 'media');
  const w = new BrowserWindow({ width: 1100, height: 760, backgroundColor: '#000', autoHideMenuBar: true });
  w.loadFile(path.join(__dirname, 'www', 'index.html'));
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
