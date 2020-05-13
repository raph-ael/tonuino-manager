import filesystem from "./filesystem";

const { ipcRenderer } = require('electron');
import devices from "./devices";

let api_router = {

    init: () => {

        ipcRenderer.on('command-from-window', (event, arg) => {

            if(api_router[arg.command] !== undefined) {

                api_router[arg.command](arg.params, (answer) => {

                    /*
                     * sende antwort an das fenster über den main prozess
                     */
                    ipcRenderer.send('answer-from-worker', {
                        command: arg.command, answer: answer
                    });

                });
            }
        });
    },

    ping: (params, callback) => {

        callback('pong');

    },

    list_devices: async (params, callback) => {

        let drives = await devices.list();

        callback(drives);

    },

    list_all: async (params, callback) => {

        let folders_and_files = await devices.listAll(params.drive);

        callback(folders_and_files);

    },

    add_files: async (params, callback) => {

        let copied_files = await filesystem.copyMp3sToFolder(params.files, params.folder);

        let mp3s = await filesystem.getAllMp3FromFolder(params.folder.path);

        callback(mp3s);

    }

};

export default api_router;