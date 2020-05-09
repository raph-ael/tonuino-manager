import device_manager from '../device_manager';
import app from '../app';
import router from '../router';
import helper from "../../helper";

let page_home = {

    init: () => {

        let $select = $('<div></div>').uiFormDropdown({
            values: [],
            title: 'Wähle die SD-Karte',

            onChange: (item) => {

                router.loadPage('manager', item);

            },

            renderItem: (item) => {
                let $item = $(`
                <a data-value="` + item.value + `" class="dropdown-item" href="#">
                    <i class="` + item.icon + ` fa-2x float-left mr-3 mt-2"></i>
                    <span>` + item.name + ` <strong>` + item.size + `</strong></span><br />
                    <small>` + item.desc + `</small>
                    
                </a>`);

                if(item.icon !== undefined) {
                    $item.prepend('');
                }

                return $item;
            }
        });

        $select.addClass('w-100 text-center');
        $select.$button.addClass('btn-lg w-100 btn-light');
        $select.$menu.addClass('w-100');

        let $div = $(`<div class="row">
            <div class="col-2"></div>
            <div class="col-8 middlecol text-center"></div>
            <div class="col-2"></div>
          </div>`);

        let $middle = $div.find('.middlecol');

        $middle.append($select);

        app.$main.append($div);

        device_manager.find_sd_cards((drives) => {

            $.each(drives, (i, drive) => {

                console.log(drive);

                if(drive.mountpoints.length > 0) {

                    let icon = 'fas fa-hdd';

                    if(drive.busType === 'USB') {
                        icon = 'fab fa-usb';
                    }

                    $select.addItem({
                        value: drive.mountpoints[0].path,
                        name: drive.device,
                        icon: icon,
                        size: helper.bytesToSize(drive.size),
                        desc: drive.description
                    });
                }



            });
        });

    }

};

export default page_home;