/**
 * TODO:
 * - Current version provides data from init requests (number of requests are the number of 
 *   added shows) in which case at some point we hit request limit by api provider.
 * - Flow should go this way: (api GET)->(sync google storage)->(render), api will be called
 *   from injected button where 2 requests should be triggered (api/find and api/tv)
 * - Refactor promise waterfall
 * - Tv shows will be limited to 40 imports
 */

//  chrome.storage.local.clear(function() {});

// var storage = Storage.get();
// console.log(storage);

App = {
    init: function() {
        App.setView();
    },

    deleteShow: async function() {
        let imdb_id = this.getAttribute('data-show-delete');

        await Storage.setKey(SHOWS)
                    .destroy(imdb_id);
        init(SHOWS);
    },

    deleteMovie: async function() {
        let imdb_id = this.getAttribute('data-movie-delete');

        await Storage.setKey(MOVIES)
                    .destroy(imdb_id);
        init(MOVIES);
    },

    bindTabClick: function() {
        let tab = this;
    
        App.setView(tab.getAttribute('data-tab'));
        activeTab(tab);
    },

    setView: async function(view) {
        let storage = await Storage.get();
        let view_render = document.getElementById('view-render');

        switch(view) {
            case SHOWS:
                view_render.innerHTML = DOM.render(SHOWS, storage.shows);
                document.querySelectorAll('[data-show-delete]').forEach((e) => {
                    e.addEventListener('click', App.deleteShow);
                });
                break;

            case MOVIES:
                view_render.innerHTML = DOM.render(MOVIES, storage.movies);
                document.querySelectorAll('[data-movie-delete]').forEach((e) => {
                    e.addEventListener('click', App.deleteMovie);
                });
                break;

            default:
                view_render.innerHTML = DOM.render(TODAY_SHOWS, storage.shows);
                view_render.innerHTML += DOM.render(SEVEN_DAYS_SHOWS, storage.shows);
        }
    }
}

document.addEventListener('DOMContentLoaded', App.init);
document.querySelectorAll('[data-tab]').forEach((e) => {
    e.addEventListener('click', App.bindTabClick);
});