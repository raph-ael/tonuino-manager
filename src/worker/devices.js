const drivelist = require('drivelist');
const disk = require('diskusage');
import helper from "../helper";
import fs from 'fs';

let devices = {

    untouchable_folders: ['mp3', '.tmanager.sqlite'],

    list: async (callback) => {

        const drives = await drivelist.list();

        let out = [];

        drives.forEach(async (drive) => {

            let path = drive.mountpoints[0].path;

            let { free } = await disk.check(path);
            out.push({
                name: drive.device,
                path: path,
                size: drive.size,
                free: free,
                busy: (drive.size-free),
                size_format: helper.bytesToSize(drive.size),
                free_format: helper.bytesToSize(free),
                busy_format: helper.bytesToSize(drive.size-free)
            });
        });

        return out;
    },

    listDirectoriesAndFiles: (drive, cb) => {

        fs.readdir(drive.path, (err, items) => {

            let out = [];

            for (let i=0; i<items.length; i++) {
                if(devices.untouchable_folders.indexOf(items[i]) === -1) {
                    out.push(items[i]);
                }
            }
            cb(out);
        });

    },

};

export default devices;