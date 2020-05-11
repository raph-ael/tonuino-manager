import worker_api from "../worker_api";
import app from '../app';

let device_select = {

    $select: null,
    $dropdown: null,
    $list: null,
    dropdown_visible: false,
    $value: null,

    init: () => {

        device_select.$select = $('#device-select');
        device_select.$dropdown = $('#device-dropdown');
        device_select.$list = device_select.$dropdown.find('.list-group');
        device_select.$value = device_select.$select.find('.display-value');

        device_select.initEvents();
        device_select.initDevices();

    },

    initDevices: () => {

        device_select.$list.empty();

        worker_api.command('list_devices', {
            success: (devices) => {

                devices.forEach((device) => {

                    let $li = $(`
                        <li class="list-group-item">
                          <span class="icon icon-drive icon-text"></span> ` + device.name + ` <strong>` + device.size_format + `</strong>
                        </li>
                    `);

                    $li.click((ev) => {
                        device_select.$dropdown.hide();
                        device_select.dropdown_visible = false;
                        device_select.$value.text(device.name);
                        app.setDevice(device);
                        app.reload();
                    });

                    device_select.$list.append($li);

                });

            }
        });

    },

    initEvents: () => {

        device_select.$select.click((ev) => {

            if(device_select.$dropdown.is(':visible')) {
                device_select.$dropdown.hide();
                device_select.dropdown_visible = false;
            }
            else {
                device_select.$dropdown.show();
                device_select.dropdown_visible = true;
            }
        });

        $(document).mouseup((e) => {

            if(
                device_select.dropdown_visible === true &&
                ( !device_select.$dropdown.is(e.target) && device_select.$dropdown.has(e.target).length === 0 ) &&
                ( !device_select.$select.is(e.target) && device_select.$select.has(e.target).length === 0 )
            ) {
                device_select.$dropdown.hide();
                device_select.dropdown_visible = false;
            }
        });

    }

};

export default device_select;