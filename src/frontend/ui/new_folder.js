import worker_api from "../worker_api";
import app from "../app";
import folder_list from "./folder_list";

let new_folder = {

    $btn: null,

    init: () => {

        new_folder.$btn = $('#btn-create-new-folder');

        new_folder.$btn.click(() => {

            worker_api.command('new_folder', {
                data: {
                    drive: app.device
                },
                success: (folder) => {
                    folder_list.addFolder(folder);
                    app.setFolder(folder);
                    folder_list.activateFolder(folder.folder_name);

                }
            })

        });
    }

};

export default new_folder;