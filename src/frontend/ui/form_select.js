$.fn.uiFormSelect = function(options) {

    /*
    HANDLE OPTIONS
     */
    let $element = $(this);
    let $item_container, $select;
    let $input;
    let values = {};

    options = $.extend({},{
        wrapper: false,
        default: false,
        values: []
    }, options);


    let plugin = this;

    this.renderItem = (item) => {

        let $item = $(`
            <option value="` + item.value + `">` + item.name + `</option>`);

        if(item.icon !== undefined) {
            $item.prepend('<x-icon name="' + item.icon + '"></x-icon>');
        }

        return $item;
    };

    // public methods
    this.initialize = () => {

        $element.addClass('custom-select');

        options.values.forEach((val) => {

            $element.append(plugin.renderItem(val))

        });

        return plugin;

    };

    this.addValue = (value, name) => {
        $element.append($(plugin.renderItem({
            value: value,
            name: name
        })));
    };

    this.initValues = (values) => {

    };

    this.setValue = (value) => {

    };

    this.resetValue = () => {

    };

    return this.initialize();
};
