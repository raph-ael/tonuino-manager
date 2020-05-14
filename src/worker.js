import filesystem from "./worker/filesystem";

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

import api_router from "./worker/api_router";

api_router.init();
filesystem.init();
