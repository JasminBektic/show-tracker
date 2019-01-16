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
  
    if (isShowAdded(imdb_id)) {
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
                overview: show.overview,
                name: show.name,
                backdrop_path: show.backdrop_path,
                homepage: show.homepage,
                last_air_date: show.last_air_date,
                poster_path: show.poster_path,
                status: show.status,
                type: show.type,
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