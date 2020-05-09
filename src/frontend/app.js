import router from "./router";

const app = {

    $main: null,
    $head: null,
    $loader: null,

    init: () => {

        app.$main = $('#main');
        app.$head = $('body > header');
        app.$loader = $('#loading-indicator');

        router.initLinks();
        router.loadPage('home');

    },

    showLoading: () => {
        app.$loader.show();
    },

    hideLoading: () => {
        app.$loader.hide();
    }


};

export default app;