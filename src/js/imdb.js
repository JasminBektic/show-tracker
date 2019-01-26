Imdb = {
    init: function() {
        let add_button = DOM.render(IMDB_ADD_BUTTON);
        let messages = DOM.render(IMDB_MESSAGES);

        add_button.querySelector('button').addEventListener('click', Imdb.bindAddClickEvent);
    
        document.querySelector('div#title-overview-widget div.wlb-title-main-details').appendChild(add_button);
        document.getElementById('wrapper').appendChild(messages);
    },

    bindAddClickEvent: async function() {
        let imdb_id = window.location.pathname.split('/')[2];
        let btn_loader = document.getElementById('imdb-button-loader');
        
        if (added_show = await Imdb.findAddedShow(imdb_id)) {
            Imdb.showMessage(`"${added_show.name}" is already added.`, ERROR);
            return;
        }

        btn_loader.classList.add('imdb-button-loader--active');

        Api.getByImdb(imdb_id)
            .then((response) => {
                response = Api.imdbResponsePurifier(response);
                Storage.setKey(response.key_type);
    
                return Api.getById(response.data.id);
            })
            .then((show) => {
                show.imdb_id = imdb_id;
                
                Storage.insert(Storage.getKey() == SHOWS ? 
                    Storage.prepareShowStructure(show)
                        :
                    Storage.prepareMovieStructure(show));
                
                Imdb.showMessage(`"${show.name}" is successfully added.`, SUCCESS);
                btn_loader.classList.remove('imdb-button-loader--active');
            })
            .catch(() => {
                Imdb.showMessage('An error occurred, try again.');
                btn_loader.classList.remove('imdb-button-loader--active');
            });
    },

    findAddedShow: async function(imdb_id) {
        let storage = await Storage.get();
        let merged_shows = storage.shows.concat(storage.movies);
    
        let founded = merged_shows.find((show) => {
            return show.imdb_id == imdb_id;
        });
        
        return founded;
    },

    showMessage: function(text, type) {
        let message_box = document.getElementById('imdb-message');

        if (message_box.innerHTML != '') return;

        message_box.classList.remove('imdb-message-success', 
                                     'imdb-message-warning', 
                                     'imdb-message-error');
        switch(type) {
            case SUCCESS:
                message_box.classList.add('imdb-message-success');
                break;

            case ERROR:
                message_box.classList.add('imdb-message-warning');
                break;

            default:
                message_box.classList.add('imdb-message-error');
        }
        message_box.innerHTML = text;

        setTimeout(() => {
            message_box.innerHTML = '';
            message_box.classList.remove('imdb-message-success', 
                                         'imdb-message-warning', 
                                         'imdb-message-error');
        }, 2500);
    }
}

Imdb.init();