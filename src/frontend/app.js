import worker_api from "./worker_api";
import device_select from "./ui/device_select";
import folder_list from "./ui/folder_list";

let app = {

    $page: null,
    $page_loader: null,
    $pane_main: null,
    $pane_main_loader: null,
    device: null,

    init: () => {

        $('tbody').sortable();

        app.$page = $('#fullpage');
        app.$page_loader = $('#fullpage-loader');
        app.$pane_main = $('#main-pane');
        app.$pane_main_loader = $('#main-pane-loader');

        /*
         * initialisiere worker api
         */
        worker_api.init();

        /*
         * init device selector
         */
        device_select.init();

        setTimeout(() => {
            app.hideFullpageLoader();
        },500);


    },

    showMainLoader: () => {
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
    },


    reload: () => {
        app.showMainLoader();
        worker_api.command('list_all', {
            data: {
                drive: app.device
            },
            success: (folder) => {

                console.log(folder);

            }
        });
    }

};

export default app;