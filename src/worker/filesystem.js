const fs = require('fs');
const path = require('path');
const glob = require('glob');
const FileType = require('file-type');
const util = require('util');
import helper from "../helper";
const mm = require('musicmetadata');
const { ipcRenderer } = require('electron');
const electron = require('electron');

const readdir = util.promisify(fs.readdir);

const metadata = util.promisify(mm);

let filesystem = {

    path_data: null,
    path_user: null,
    path_coverart: null,

    init: async () => {
        filesystem.path_data = electron.remote.app.getPath('appData');
        filesystem.path_user = electron.remote.app.getPath('userData');
        filesystem.path_coverart = path.join(filesystem.path_user, 'coverart');
        if (!await fs.existsSync(filesystem.path_coverart)) {
            await fs.mkdirSync(filesystem.path_coverart);
        }
    },

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

                            let message = '';
                            if(options.status_text !== undefined) {
                                message = options.status_text + ' ';
                            }
                            message += file + '<br>' + track.name + ' - ' + track.artist;

                            ipcRenderer.send('status-message', {
                                message: message
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
    },

    getFirstAlbumArtCover: async (fullpath, foldername) => {

        let files;

        try {
            files = await readdir(fullpath);
        } catch (err) {
            console.log(err);
        }
        if (files === undefined) {
            console.log('undefined');
        } else {

            files.sort();

            let image = null;

            await helper.asyncForEach(files, async (file) => {
                if(file.indexOf('.mp3') !== -1) {

                    if(!image) {

                        let meta = await metadata(fs.createReadStream(path.join(fullpath, file)));

                        if(meta && meta.picture && meta.picture.length > 0) {

                            console.log(meta.picture);

                            try {

                                let imagename = foldername + '.' + meta.picture[0].format;

                                await fs.writeFileSync(path.join(filesystem.path_coverart, imagename), meta.picture[0].data);

                                image = imagename;

                            } catch (err) {
                                console.log(err);
                                image = null;
                            }
                        }
                    }
                }
            });

            return image;
        }
    },

    newFolder: async (fullpath) => {

        let files;

        try {
            files = await readdir(fullpath);
        } catch (err) {
            console.log(err);
        }
        if (files === undefined) {
            console.log('undefined');
        } else {

            files.sort();

            let highest_folder_number = 0;

            await helper.asyncForEach(files, async (file) => {

                if(fs.lstatSync(path.join(fullpath, file)).isDirectory()) {

                    if (file.length === 2) {
                        let number = parseInt(file);
                        if (highest_folder_number < number) {
                            highest_folder_number = number;
                        }
                    }
                }
            });

            let new_number = (highest_folder_number+1);
            let new_folder_name = ('00' + new_number).slice(-2);

            await fs.mkdirSync(path.join(fullpath, new_folder_name));

            let folder = {
                name: new_folder_name,
                artists: [],
                albums: [],
                folder_name: new_folder_name,
                title: [],
                type: 'other',
                filetype: null,
                path: path.join(fullpath, new_folder_name),
                image: null
            };

            return folder;

        }



    }
};

export default filesystem;