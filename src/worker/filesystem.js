const fs = require('fs');
const path = require('path');
const glob = require('glob');
const FileType = require('file-type');
const util = require('util');
import helper from "../helper";
const mm = require('musicmetadata');


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

    getAllMp3FromFolder: async (fullpath) => {

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

                        mp3s.push(track);
                    }
                }

            });

            return mp3s;

        }

        return false;

    }

};

export default filesystem;