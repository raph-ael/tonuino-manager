import page_home from "./pages/home";
import page_manager from "./pages/manager";
import app from "./app";

let router = {

    pages: {
        home:  page_home,
        manager: page_manager
    },

    init: () => {



    },

    initLinks: () => {

        document.querySelectorAll('.router-link').forEach((link) => {

            if(link.className.indexOf('has-a-link') === -1) {

                link.classList.add('has-a-link');

                link.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    let l = ev.currentTarget;
                    router.loadPage(l.href.split('#')[1]);
                    router.initLinks();
                });
            }
        });

    },

    loadPage: (page, params) => {
        app.$main.empty();
        app.$head.empty();
        router.pages[page].init(params);
    }

};

export default router;