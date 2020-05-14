import app from '../app';

let folder_list = {

    $list: null,

    init: () => {
        folder_list.$list = $('#folder-list');
        folder_list.setTitle('Ordner');
    },

    setTitle: (title) => {
        folder_list.$list.find('li.title').remove();
        folder_list.$list.prepend('<li class="title"><h5 class="nav-group-title">' + title + '</h5></li>');
    },

    appendTitle: (title) => {
        folder_list.$list.append('<li class="title"><h5 class="nav-group-title">' + title + '</h5></li>');
    },

    setFolders: (folders) => {

        folder_list.$list.empty();

        folder_list.appendTitle(folders.tonuino_folder.length + ' Tonuino Ordner');
        folders.tonuino_folder.forEach((folder) => {
            folder_list.$list.append(folder_list.renderTonuinoFolder(folder));
        });

        folder_list.appendTitle(folders.tonuino_system.length + ' Tonuino System-Ordner');
        folders.tonuino_system.forEach((folder) => {
            folder_list.$list.append(folder_list.renderSystemFolder(folder));
        });

        if(folders.other.length > 0) {
            folder_list.appendTitle('Sonstige Ordner & Dateien');
            folders.other.forEach((folder) => {
                folder_list.$list.append(folder_list.renderOther(folder));
            });
        }
    },

    renderTonuinoFolder: (folder) => {

        let title = folder.name;
        if(folder.albums.length > 0) {
            title = folder.albums.join(', ');
        }

        if(folder.artists.length > 0) {
            title += '<br>' + folder.artists.join(', ');
        }

        let image_src = 'coverart://placeholder.png';
        if(folder.image) {
            image_src = 'coverart://' + folder.image;
        }

        let $li = $(`
            <li class="list-group-item">
            <img class="media-object pull-left" src="` + image_src + `" width="52" height="52">
            <div class="media-body">
              <strong>` + folder.folder_name + `</strong> <span class="pull-right">` + folder.title.length + ` Titel</span>
              <p>` + title + `</p>
            </div>
          </li>
        `);

        $li.click(() => {
            folder_list.$list.find('.active').removeClass('active');
            $li.addClass('active');
            app.setFolder(folder);
        });

        return $li;

    },

    renderSystemFolder: (folder) => {

        let title = folder.name;

        if(title === 'mp3') {
            title = 'Tonuino Sprachansagen';
        }

        return $(`
            <li class="list-group-item">
            <img class="media-object pull-left" src="http://via.placeholder.com/32x32" width="32" height="32">
            <div class="media-body">
              <strong>` + folder.folder_name + `</strong>
              <p>` + title + `</p>
            </div>
          </li>
        `);
    },

    renderOther: (folder) => {

        let title = folder.name;

        return $(`
            <li class="list-group-item">
            <img class="media-object pull-left" src="http://via.placeholder.com/32x32" width="32" height="32">
            <div class="media-body">
              <strong>` + folder.folder_name + `</strong>
              <p>` + title + `</p>
            </div>
          </li>
        `);
    }

};

export default folder_list;