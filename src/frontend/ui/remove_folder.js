import dialog from "../dialog";
import app from '../app';
import worker_api from "../worker_api";
import folder_list from "./folder_list";

let remove_folder = {
    $btn: null,
    init: () => {

        remove_folder.$btn = $('#btn-remove-folder');

        remove_folder.$btn.click(() => {

            dialog.open({
                title: app.folder.folder_name + ' löschen',
                message: 'Wirklich löschen?',
                detail: 'Möchtest Du den Ordner ' + app.folder.folder_name + ' wirklich löschen? Der Vorgang kann nicht rückgängig gemacht werden.',
                buttons: ['Nein, lieber doch nicht', 'Ja, Ordner löschen']
            }, (response) => {

                if(response.answer === 2) {

                    worker_api.command('remove_folder', {
                        data: {
                            drive: app.device,
                            folder: app.folder,
                        },
                        success: (response) => {
                            folder_list.removeFolder(app.folder);
                            folder_list.activateFirst();
                        }
                    });

                }

            });

        });

    }
};

export default remove_folder;