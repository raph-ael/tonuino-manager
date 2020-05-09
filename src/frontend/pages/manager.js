import device_manager from '../device_manager';
import app from '../app';
import router from '../router';
import helper from "../../helper";
const disk = require('diskusage');
import database from "../database";
import drive from "../drive";
const { ipcRenderer } = require('electron');

let page_manager = {

    drive: null,
    $head: null,
    $main: null,
    $drive_progress: null,
    $drive_progress_bar: null,
    $head_subtitle: null,

    init: (drive_data) => {

        /*
         * initialisiere SD-Karte
         */
        drive.init(drive_data);

        drive.listDirectoriesAndFiles((files) => {

            console.log(files);

        });


        page_manager.drive = drive_data;

        /*
         * erzeuge dom elemente
         */
        page_manager.initLayout();

        /*
         * lese SD-Karten SPeicherplatz infos
         */
        page_manager.initDriveSpace();


        /*
         * prüfe ob Datenbank für SD-Karte existiert
         */


    },

    initDriveSpace: () => {

        disk.check(page_manager.drive.value, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.available);
                console.log(info.free);
                console.log(info.total);

                page_manager.setDriveProgress(info.total, info.free);
            }
        });

    },

    initLayout: () => {

        page_manager.initLayoutHead();
        page_manager.initLayoutMain()

    },

    initLayoutMain: () => {

        let $content = $('<div id="folder-acc"></div>');

        let folders = database.getAll();

        folders.forEach((folder) => {

            let $section = $(`
            <div class="card">
                <div class="card-header" id="manager-heading-folder-` + folder.id + `">
                  <div class="mb-0">
                    <table style="width: 100%">
                        <tr>
                            <td style="width: 60px"><i class="mr-3 fas fa-folder float-left fa-3x"></i></td>
                            <td style="width: 70%"><button style="text-align:left; height: 25px; white-space: nowrap;width: 75%; overflow: hidden; text-overflow: ellipsis;" class="ml-0 pl-0 mb-0 pb-0 btn btn-link" data-toggle="collapse" data-target="#manager-folder-` + folder.id + `" aria-expanded="true" aria-controls="manager-folder-` + folder.id + `">
                       ` + folder.name + `
                    </button><br>
                    <small>` + folder.title.length + ` Titel</small></td>
                            <td style="width: 60px"><strong class="float-right" style="font-size: 3rem">` + folder.folder + `</strong></td>
                        </tr>
                    </table>
                    
                    
                  </div>
                </div>
            
                <div id="manager-folder-` + folder.id + `" class="collapse" aria-labelledby="manager-heading-folder-` + folder.id + `" data-parent="#folder-acc">
                  <div class="card-body p-0">
                    
                  </div>
                </div>
             </div>`);

            let $body = $section.find('.card-body');

            let $table = $('<table class="table"><thead><tr><th style="width:35px">&nbsp;</th><th>Name</th><th style="width:110px">Datei</th></tr></thead><tbody></tbody></table>');

            let $tbody = $table.find('tbody');

            folder.title.forEach((title) => {
                $tbody.append($(`
                    <tr>
                        <td><i class="fas fa-file-audio"></i></td>
                        <td>` + title.name + `</td>
                        <td>` + title.file + `</td>
                    </tr>
                `));
            });

            $body.append($table);

            $section.appendTo($content);

        });

        app.$main.append($content);

    },

    initLayoutHead: () => {
        page_manager.$head = $(`
        <div>
            <h4>` + page_manager.drive.name + `</h4>
        </div>`);

        page_manager.$drive_progress = $(`
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>`);
        page_manager.$drive_progress_bar = page_manager.$drive_progress.find('.progress-bar');
        page_manager.$head.append(page_manager.$drive_progress);
        page_manager.$head_subtitle = $('<small></small>');
        page_manager.$head.append(page_manager.$head_subtitle);


        app.$head.append(page_manager.$head);

        /*
         * purge button
         */
        let $btn_del = $('<button>PURGE!</button>');
        $btn_del.click(() => {
            if(confirm('echt jetzt?')){
                drive.purge(() => {
                    router.loadPage('manager', page_manager.drive);
                });
            }
        });

        app.$head.append($btn_del);

        /*
         * add folder button
         */
        let $btn_add = $('<button>ADD!</button>');
        $btn_add.click(() => {
            ipcRenderer.send('select-dir');
        });
        ipcRenderer.on('add-folder' , (event , data) => {
            console.log(data)
        });

        app.$head.append($btn_del);
        app.$head.append($btn_add);
    },

    setDriveProgress: (size, free) => {

        let percent = Math.round((size-free) / (size/100));
        page_manager.$head_subtitle.html('<strong>' + helper.bytesToSize(free) + '</strong> von ' + '<strong>' + helper.bytesToSize(size) + '</strong> frei');
        page_manager.$drive_progress_bar.css('width', percent+'%').attr('aria-valuenow', percent);
    }

};

export default page_manager;