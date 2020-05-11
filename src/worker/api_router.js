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

    list_all: (params, callback) => {

        devices.listDirectoriesAndFiles(params.drive, (folders_and_files) => {
            callback(folders_and_files);
        });

    }

};

export default api_router;