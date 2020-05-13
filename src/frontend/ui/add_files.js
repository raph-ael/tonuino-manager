import app from '../app';
import worker_api from "../worker_api";
import track_table from "./track_table";
const { ipcRenderer } = require('electron');

let add_files = {

    $btn: null,

    init: () => {
        add_files.$btn = $('#btn-add-files');

        add_files.initEvents();

        ipcRenderer.on('mp3s-choosed', (event, files) => {

            add_files.add(files);

        });

    },

    initEvents: () => {

        add_files.$btn.click(() => {

            if(app.folder) {
                ipcRenderer.send('open-mp3-chooser');
            }
            else {
                alert('Du musst erst einen Ordner wählen');
            }

        });

    },

    add: (files) => {
        if(files && files.length > 0) {

            app.showMainLoader();

            worker_api.command('add_files', {
                data: {
                    files: files,
                    folder: app.folder
                },
                success: (mp3s) => {

                    app.setMp3sForFolder(mp3s);
                    track_table.reload();
                    app.hideMainLoader();

                }
            });

        }
    }


};

export default add_files;