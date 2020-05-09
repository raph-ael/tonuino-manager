$.fn.uiFormDropdown = function(options) {

    /*
    HANDLE OPTIONS
     */
    let $element = $(this);
    let $button, $menu;
    let $input;
    let values = {};

    options = $.extend({},{
        wrapper: false,
        default: false,
        values: [],
        title: 'Bitte wählen...',
        renderItem: (item) => {

            let $item = $(`<a data-value="` + item.value + `" class="dropdown-item" href="#"><span>` + item.name + `</span></a>`);

            if(item.icon !== undefined) {
                $item.prepend('<i class="fab fa-usb fa-4x float-left"></i>');
            }

            return $item;
        }
    }, options);


    let plugin = this;

    // public methods
    this.initialize = () => {

        $element.addClass('dropdown');

        $button = $(`<button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">` + options.title + `</button>`);

        $menu = $(`<div class="dropdown-menu"></div>`);

        options.values.forEach((val) => {

            plugin.addItem(val);

        });

        $element.append($button);
        $element.append($menu);

        plugin.$button = $button;
        plugin.$menu = $menu;

        return plugin;

    };

    this.addItem = (item) => {

        let $item = $(options.renderItem(item));

        $item.click(() => {

            options.onChange(item);

        });

        $menu.append($item);
    };

    this.initValues = (values) => {

    };

    this.setValue = (value) => {

    };

    this.resetValue = () => {

    };

    return this.initialize();
};
