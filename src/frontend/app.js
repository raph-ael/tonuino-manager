import worker_api from "./worker_api";
import device_select from "./ui/device_select";
import window_actions from "./ui/window_actions";
import folder_list from "./ui/folder_list";
import track_table from "./ui/track_table";
import add_files from "./ui/add_files";
const { ipcRenderer } = require('electron');

let app = {

    $page: null,
    $page_loader: null,
    $pane_main: null,
    $pane_main_loader: null,
    device: null,
    folder: null,
    $btn_group_right: null,
    $btn_group_folder_opt: null,
    $header: null,

    init: () => {

        $('tbody').sortable();

        app.$page = $('#fullpage');
        app.$page_loader = $('#fullpage-loader');
        app.$pane_main = $('#main-pane');
        app.$pane_main_loader = $('#main-pane-loader');
        app.$btn_group_right = $('#btn-group-right');
        app.$btn_group_folder_opt = $('#btn-group-folder-options');
        app.$header = $('#fullpage > header');
        app.$status_message = app.$pane_main_loader.find('.status-message');

        /*
         * initialisiere window action buttons
         */
        window_actions.init();

        /*
         * initialisiere worker api
         */
        worker_api.init();

        /*
         * Order-UI initialisieren
         */
        folder_list.init();

        /*
         * Track-UI initialisieren
         */
        track_table.init();

        /*
         * init device selector
         */
        device_select.init();

        /*
         * init file add button
         */
        add_files.init();

        /*
         * autodetect sdcard
         */
        app.hideFullpageLoader();

        /*
         * listen for status messages
         */
        ipcRenderer.on('status-message', (event, arg) => {
            app.$status_message.text(arg.message);
        });


    },

    showMainLoader: () => {
        app.$status_message.text('');
        app.$pane_main.hide();
        app.$pane_main_loader.show();
    },

    hideMainLoader: () => {
        app.$pane_main.show();
        app.$pane_main_loader.hide();
    },

    showFullpageLoader: () => {
        app.$page_loader.css('display', 'table');
        app.$page.hide();
    },

    hideFullpageLoader: () => {
        app.$page_loader.css('display', 'none');
        app.$page.show();
    },

    setDevice: (device) => {
        app.device = device;
        if(device) {
            app.$btn_group_folder_opt.show();
        }
        else {
            app.$btn_group_folder_opt.hide();
        }
    },


    reload: (callback) => {
        app.showMainLoader();
        worker_api.command('list_all', {
            data: {
                drive: app.device
            },
            success: (folder) => {

                folder_list.setFolders(folder);
                app.hideMainLoader();
                if(callback !== undefined) {
                    callback();
                }

                device_select.reload();

            }
        });
    },

    autodetect_cd_card: (callback) => {

        /*
         * timeout
         */
        let timeout = setTimeout(() => {
            callback(false);
        }, 5000);

        worker_api.command('list_devices', {
            success: (devices) => {

                devices.forEach((device) => {
                    if(device.size < 35433480192) {
                        clearTimeout(timeout);
                        device_select.setDevice(device);
                        app.setDevice(device);
                        callback(device);
                    }
                });
            }
        });

    },

    setFolder: (folder) => {
        app.folder = folder;
        track_table.setFolder(folder);
        if(folder) {
            app.$btn_group_right.show();
        }
        else {
            app.$btn_group_right.hide();
        }
    },

    setMp3sForFolder: (mp3s) => {
        if(app.folder) {
            app.folder.title = mp3s;
        }
    }

};

export default app;