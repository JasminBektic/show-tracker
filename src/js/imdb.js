Imdb = {
    init: function() {
        let add_button = DOM.render(IMDB_ADD_BUTTON);
        add_button.firstChild.addEventListener('click', Imdb.bindAddClickEvent);
    
        // document.getElementById('wrapper').appendChild(add_button);
        document.querySelector('div#title-overview-widget div.wlb-title-main-details').appendChild(add_button);
    },

    bindAddClickEvent: async function() {
        var imdb_id = window.location.pathname.split('/')[2];
        
        // if (added_show = await Imdb.findAddedShow(imdb_id)) {
        //     message(`You already added ${added_show.name}.`);
        //     return;
        // }
    
        Api.getByImdb(imdb_id)
            .then((response) => {
                response = Api.imdbResponsePurifier(response);
                Storage.setKey(response.key_type);
    
                return Api.getById(response.data.id);
            })
            .then((show) => {
                console.log(show);
                
                show.imdb_id = imdb_id;
                
                Storage.insert(Storage.getKey() == SHOWS ? 
                    Storage.prepareShowStructure(show)
                        :
                    Storage.prepareMovieStructure(show));
                
                message((Storage.getKey() == SHOWS ? 'TV show' : 'Movie') + ' successfully added.');
            })
            .catch(() => {
                message('An error occurred, try again.');
            });
    },

    findAddedShow: async function(imdb_id) {
        let storage = await Storage.get();
        let merged_shows = storage.shows.concat(storage.movies);
    
        let founded = merged_shows.find((show) => {
            return show.imdb_id == imdb_id;
        });
        
        return founded;
    }
}

Imdb.init();