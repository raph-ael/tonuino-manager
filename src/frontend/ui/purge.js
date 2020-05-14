import worker_api from "../worker_api";
import app from '../app';
//const dialog = require('electron').remote.dialog;
const { BrowserWindow } = require('electron').remote;
import dialog from "../dialog";


let purge = {

    $btn: null,

    init: () => {

        purge.$btn = $('#btn-purge');

        purge.$btn.click(async () => {

            dialog.open({
                title: 'SD-Karte säubern',
                buttons: ['Nein, doch nicht', 'SD-Karte säubern'],
                message: 'Bist Du Dir Sicher?',
                detail: 'Diese Aktion wird alle Ordner und mp3 Dateien neu Sortieren. Alles was nichts auf der SD Karte wird entfernt.'
            }, (response) => {

                if(response.answer === 2) {
                    worker_api.command('purge_device',{
                        data: {
                            drive: app.device
                        },
                        success: () => {
                            app.showMainLoader();
                            app.reload(() => {
                                app.hideMainLoader();
                            });
                        }
                    });
                }

            });

            /*
             * Button 1 wurde geklickt
             */


        });

    }

};

export default purge;