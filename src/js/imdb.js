var add_button = createAddButton();
var button_wrapper = createAddButtonWrapper();
button_wrapper.appendChild(add_button);

document.getElementById('wrapper').appendChild(button_wrapper);

function createAddButtonWrapper() {
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'imdb-container'); 
    wrapper.style.background = 'green';

    return wrapper;
}

function createAddButton() {
    var button = document.createElement('button');
    button.innerHTML = `Add`;
    button.setAttribute('class', 'test-class'); 
    button.style.color = 'red';
    button.addEventListener('click', bindAddClickEvent);

    return button;
}

function bindAddClickEvent() {
    var imdb_id = window.location.pathname.split('/')[2];
  
    // if (isShowAdded(imdb_id)) {
    //     message('You already added this TV show.');
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
            
            Storage.insert({
                id: show.id,
                name: show.name,
                backdrop_path: show.backdrop_path,
                genres: show.genres,
                episode_run_time: show.episode_run_time,
                poster_path: show.poster_path,
                next_episode_to_air: show.next_episode_to_air,
                last_episode_to_air: show.last_episode_to_air,
                vote_average: show.vote_average
            });
            
            message('TV show successfully added.');
        })
        .catch(() => {
            message('An error occurred, try again.');
        });
}

async function isShowAdded(imdb_id) {
    var storage = await Storage.get();

    storage.shows.find((show) => {
        return show.imdb_id == imdb_id;
    });
}

function message(text) {
    alert(text);
}