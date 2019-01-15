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

    Api.getByImdb(imdb_id)
        .then((response) => {
            response = Api.imdbResponsePurifier(response);
            Storage.setKey(response.key_type);

            return Api.getById(response.data.id);
        }).then((show) => {
            // show = Api.imdbResponsePurifier(res);  TODO: implement
            
            // var storage = Storage.get();
        
            // if (isShowAdded(storage.shows, show)) {
            //     message('You already added this TV show.');
            //     return;
            // }
        
            Storage.insert(show);
            
        
            message('TV show successfully added.');
        });

}

function isShowAdded(shows, show) {
    shows.find((s) => {
        return s.imdb_id == show.imdb_id;
    });
}

function message(text) {
    alert(text);
}