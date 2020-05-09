const drivelist = require('drivelist');

let device_manager = {

    current_device: false,

    find_sd_cards: async (callback) => {
        const drives = await drivelist.list();
        callback(drives);
    }

};

export default device_manager;