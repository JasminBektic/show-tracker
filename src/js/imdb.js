init();

function init() {
    let add_button = DOM.renderImdbAddButton();
    let button_wrapper = DOM.renderImdbAddButtonWrapper();
    button_wrapper.appendChild(add_button);
    
    document.getElementById('wrapper').appendChild(button_wrapper);
}

async function bindAddClickEvent() {
    var imdb_id = window.location.pathname.split('/')[2];
    
    if (await isShowAdded(imdb_id)) {
        message('You already added this TV show.');
        return;
    }

    Api.getByImdb(imdb_id)
        .then((response) => {
            response = Api.imdbResponsePurifier(response);
            Storage.setKey(response.key_type);

            return Api.getById(response.data.id);
        })
        .then((show) => {
            Storage.insert({
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
            });
            
            message('TV show successfully added.');
        })
        .catch(() => {
            message('An error occurred, try again.');
        });
}

async function isShowAdded(imdb_id) {
    let storage = await Storage.get();
    let merged_shows = storage.shows.concat(storage.movies);

    let is_founded = merged_shows.find((show) => {
        return show.imdb_id == imdb_id;
    });
    
    return is_founded === undefined ? false : true;
}