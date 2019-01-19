Imdb = {
    init: function() {
        let add_button = DOM.render(IMDB_ADD_BUTTON);
        add_button.firstChild.addEventListener('click', Imdb.bindAddClickEvent);
    
        document.getElementById('wrapper').appendChild(add_button);
    },

    bindAddClickEvent: async function() {
        var imdb_id = window.location.pathname.split('/')[2];
        
        if (added_show = await Imdb.findAddedShow(imdb_id)) {
            message(`You already added ${added_show.name}.`);
            return;
        }
    
        Api.getByImdb(imdb_id)
            .then((response) => {
                response = Api.imdbResponsePurifier(response);
                Storage.setKey(response.key_type);
    
                return Api.getById(response.data.id);
            })
            .then((show) => {
                Storage.insert(Storage.getKey() == SHOWS ? {
                    id: show.id,
                    name: show.name,
                    backdrop_path: show.backdrop_path,
                    genres: show.genres,
                    episode_run_time: show.episode_run_time,
                    poster_path: show.poster_path,
                    next_episode_to_air: show.next_episode_to_air,
                    last_episode_to_air: show.last_episode_to_air,
                    vote_average: show.vote_average,
                    imdb_id: imdb_id
                }
                    :
                {
                    id: show.id,
                    name: show.title,
                    backdrop_path: show.backdrop_path,
                    genres: show.genres,
                    release_date: show.release_date,
                    vote_average: show.vote_average,
                    imdb_id: imdb_id
                });
                
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