import router from "./router";

const fs = require('fs');
import app from './app';

let deleteFolderRecursive = function(path) {

    if( fs.existsSync(path) ) {

        if(fs.lstatSync(path).isDirectory()) {
            fs.readdirSync(path).forEach(function(file,index){
                let curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
        else { // delete file
            fs.unlinkSync(path);
        }
    }
};

const drive = {

    drive: null,
    path: null,
    untouchable_folders: ['mp3', '.tmanager.sqlite'],

    init: (drive_data) => {

        drive.drive = drive_data;
        drive.path = drive_data.value;

    },

    hasDatabase: () => {

    },

    hasMp3Files: () => {

    },

    purge: (cb) => {
        app.showLoading();
        drive.listDirectoriesAndFiles((files_and_folders) => {
            files_and_folders.forEach((file) => {
                console.log(drive.path + '/' + file);
                deleteFolderRecursive(drive.path + '/' + file)
            });
            app.hideLoading();
            if(cb !== undefined) {
                cb();
            }
        });
    },

    listDirectoriesAndFiles: (cb) => {

        fs.readdir(drive.path, function(err, items) {

            let out = [];

            for (let i=0; i<items.length; i++) {
                if(drive.untouchable_folders.indexOf(items[i]) === -1) {
                    out.push(items[i]);
                }
            }
            cb(out);
        });

    }

};

export default drive;