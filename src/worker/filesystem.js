const fs = require('fs');
const path = require('path');
const glob = require('glob');
const FileType = require('file-type');
const util = require('util');
import helper from "../helper";
const mm = require('musicmetadata');
const { ipcRenderer } = require('electron');


const readdir = util.promisify(fs.readdir);

const metadata = util.promisify(mm);

let filesystem = {

    list: async (fullpath) => {

        let files = [];
        try {
            files = await readdir(fullpath);
        } catch (err) {
            console.log(err);
        }
        if (files === undefined) {
            console.log('undefined');
        } else {
            files.sort();

            return files;
        }

        return false;

    },

    getAllMp3FromFolder: async (fullpath, options) => {

        if(options === undefined) {
            options = {};
        }
        if(options.status === undefined) {
            options.status = false;
        }

        let files = [];
        let mp3s = [];
        try {
            files = await readdir(fullpath);
        } catch (err) {
            console.log(err);
        }
        if (files === undefined) {
            console.log('undefined');
        } else {
            files.sort();
            await helper.asyncForEach(files, async (file) => {

                if(!fs.lstatSync(path.join(fullpath, file)).isDirectory()) {

                    let type = await FileType.fromFile(path.join(fullpath, file));
                    if (type !== undefined && type.ext === 'mp3') {

                        let track = {
                            name: file,
                            file: file,
                            path: path.join(fullpath, file),
                            track: '',
                            album: '',
                            artist: ''
                        };

                        let meta = await metadata(fs.createReadStream(path.join(fullpath, file)));

                        if(meta) {
                            if(meta.title !== undefined) {
                                track.name = meta.title;
                            }
                            if(meta.artist !== undefined && meta.artist.length > 0) {
                                track.artist = meta.artist.join(',');
                            }
                            if(meta.track !== undefined && meta.track.no !== undefined && parseInt(meta.track.no) > 0) {
                                track.track = meta.track.no;
                            }
                            if(meta.album !== undefined) {
                                track.album = meta.album;
                            }
                        }

                        /*
                         * sende status an main
                         */
                        if(options.status) {
                            ipcRenderer.send('status-message', {
                                message: 'Lese ' + file + '<br>' + track.name + ' - ' + track.artist
                            });
                        }

                        mp3s.push(track);
                    }
                }

            });

            return mp3s;

        }

        return false;

    },

    copyMp3sToFolder: async (files, folder) => {

        let out = [];

        let i = 0;

        await helper.asyncForEach(files, async (file) => {

            i++;

            /*
             * sende status an main
             */
            ipcRenderer.send('status-message', {
                message: '(' + i + '/' + files.length + ') Kopiere ' + path.basename(file)
            });

            let new_number = await filesystem.getNextFreeFileNumber(folder.path);
            let new_filename = ('000' + new_number).slice(-3) + '.mp3';
            let new_path = path.join(folder.path, new_filename);
            await fs.copyFileSync(file, new_path);

            out.push(new_path);

        });

        return out;

    },

    getNextFreeFileNumber: async (path) => {
        let files;

        try {
            files = await readdir(path);
        } catch (err) {
            console.log(err);
        }
        if (files === undefined) {
            console.log('undefined');
        } else {

            files.sort();

            let highest_number = 0;

            await helper.asyncForEach(files, async (file) => {
                if(file.indexOf('.mp3') !== -1) {
                    let number = parseInt(file.split('.mp3')[0]);
                    if(number > highest_number) {
                        highest_number = number;
                    }
                }
            });

            return (highest_number+1);

        }
    }

};

export default filesystem;