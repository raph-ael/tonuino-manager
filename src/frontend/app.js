import worker_api from "./worker_api";
import device_select from "./ui/device_select";
import window_actions from "./ui/window_actions";
import folder_list from "./ui/folder_list";
import track_table from "./ui/track_table";
import add_files from "./ui/add_files";
import dropdowns from "./ui/dropdowns";
import helper from "../helper";
import new_folder from "./ui/new_folder";
import purge from "./ui/purge";
import dialog from "./dialog";
import remove_folder from "./ui/remove_folder";
const { ipcRenderer } = require('electron');
const electron = require('electron');

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
    path_user: null,
    path_data: null,

    init: () => {

        app.$page = $('#fullpage');
        app.$page_loader = $('#fullpage-loader');
        app.$pane_main = $('#main-pane');
        app.$pane_main_loader = $('#main-pane-loader');
        app.$btn_group_right = $('#btn-add-files');
        app.$btn_group_folder_opt = $('#btn-group-folder-options');
        app.$header = $('#fullpage > header');
        app.$status_message = app.$pane_main_loader.find('.status-message');

        /*
         * pfade
         */
        app.path_data = electron.remote.app.getPath('appData');
        app.path_user = electron.remote.app.getPath('userData');

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
         * init file add button
         */
        add_files.init();

        /*
         * dropdown
         */
        dropdowns.init();

        /*
         * Neuer Ordner Button
         */
        new_folder.init();

        /*
         * SD Karte säubern Button
         */
        purge.init();

        /*
         * Dialog Fenster
         */
        dialog.init();

        /*
         * Ordner lösche Button
         */
        remove_folder.init();

        /*
         * init device selector
         */
        device_select.init(() => {
            /*
             * autodetect sdcard
             */
            app.hideFullpageLoader();
        });

        /*
         * listen for status messages
         */
        ipcRenderer.on('status-message', (event, arg) => {
            app.$status_message.html(arg.message);
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

    setFolder: (folder) => {
        app.folder = folder;
        track_table.setFolder(folder);
        if(folder) {
            app.$btn_group_right.show();
            folder_list.$btn_remove_folder.show();
        }
        else {
            app.$btn_group_right.hide();
            folder_list.$btn_remove_folder.hide();
        }
    },

    setMp3sForFolder: (mp3s) => {
        if(app.folder) {
            app.folder.title = mp3s;
        }
    }

};

export default app;