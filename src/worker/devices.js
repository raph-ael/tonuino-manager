const path = require('path');
const drivelist = require('drivelist');
const disk = require('diskusage');
import helper from "../helper";
import fs from 'fs';
import filesystem from "./filesystem";

let devices = {

    tonuino_system_folders: ['mp3'],

    list: async (callback) => {

        const drives = await drivelist.list();

        let out = [];

        await helper.asyncForEach(drives, async (drive) => {

            let drive_path = drive.mountpoints[0].path;

            let { free } = await disk.check(drive_path);
            out.push({
                name: drive.device,
                path: drive_path,
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

    listAll: async (drive, cb) => {

        let files = await filesystem.list(drive.path);

        let out = {
            tonuino_folder: [],
            tonuino_system: [],
            other: []
        };

        await helper.asyncForEach(files, async (file) => {

            let folder = {
                name: file,
                artists: [],
                albums: [],
                folder_name: file,
                title: [],
                type: 'other',
                filetype: null
            };

            if(fs.lstatSync(path.join(drive.path, file)).isDirectory()) {

                folder.filetype = 'folder';

                if (file.length === 2) {
                    folder.number = parseInt(file);
                    if (folder.number > 0) {
                        folder.type = 'tonuino_folder';
                        folder.title = await filesystem.getAllMp3FromFolder(path.join(drive.path, file));

                        let folder_names = await devices.getNamesFromTracks(folder.title);
                        folder.artists = folder_names.artists;
                        folder.albums = folder_names.albums;
                    }
                }

                if (devices.tonuino_system_folders.indexOf(file) !== -1) {
                    folder.type = 'tonuino_system';
                }
            }
            else {
                folder.filetype = 'file';
            }

            out[folder.type].push(folder);

        });

        return out;
    },

    getNamesFromTracks: async (tracks) => {

        let artists = [];
        let albums = [];
        await helper.asyncForEach(tracks, async (track) => {
            artists.push(track.artist);
            albums.push(track.album);
        });

        artists = await helper.arrayUnique(artists);
        albums = await helper.arrayUnique(albums);

        return {
            artists: artists,
            albums: albums
        }
    }
};

export default devices;