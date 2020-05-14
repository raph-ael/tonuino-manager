import app from '../app';
import worker_api from "../worker_api";
import track_table from "./track_table";
import folder_list from "./folder_list";
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

            files.sort();

            app.showMainLoader();

            worker_api.command('add_files', {
                data: {
                    files: files,
                    folder: app.folder
                },
                success: (response) => {

                    console.log(response);
                    app.setMp3sForFolder(response.folder.title);
                    app.setFolder(response.folder);
                    folder_list.replaceFolder(response.folder);
                    folder_list.activateFolder(response.folder.folder_name);
                    app.hideMainLoader();

                }
            });

        }
    }


};

export default add_files;