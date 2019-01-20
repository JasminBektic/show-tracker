/**
 * TODO:
 * - Current version provides data from init requests (number of requests are the number of 
 *   added shows) in which case at some point we hit request limit by api provider.
 * - Flow should go this way: (api GET)->(sync google storage)->(render), api will be called
 *   from injected button where 2 requests should be triggered (api/find and api/tv)
 * - Refactor promise waterfall
 * - Tv shows will be limited to 40 imports
 * - Strict clarification for storage objects
 */

//  chrome.storage.local.clear(function() {});


App = {
    init: function() {
        App.setView();
        document.getElementById('search-filter').addEventListener('keyup', App.searchFilter);
        document.getElementById('delete-all').addEventListener('click', App.deleteAll);
    },

    searchFilter: async function(event) {
        let storage = await Storage.get();
        let active_tab = getActiveTab();

        if (active_tab == SHOWS) {
            let filtered_shows = storage.shows.filter((show) => {
                return show.name.toLowerCase().includes(event.target.value.toLowerCase());
            });
            App.setView(SHOWS, filtered_shows);
        }

        if (active_tab == MOVIES) {
            let filtered_movies = storage.movies.filter((movie) => {
                return movie.name.toLowerCase().includes(event.target.value.toLowerCase());
            });
            App.setView(MOVIES, filtered_movies);
        }
    },

    deleteShow: async function() {
        let imdb_id = this.getAttribute('data-show-delete');

        await Storage.setKey(SHOWS)
                     .destroy(imdb_id);
        App.setView(SHOWS);
    },

    deleteMovie: async function() {
        let imdb_id = this.getAttribute('data-movie-delete');

        await Storage.setKey(MOVIES)
                     .destroy(imdb_id);
        App.setView(MOVIES);
    },

    deleteAll: async function() {
        let active_tab = getActiveTab();

        await Storage.setKey(active_tab)
                     .destroyMultiple();
        App.setView(active_tab);
    },

    bindTabClick: function() {
        let tab = this;

        App.setView(tab.getAttribute('data-tab'));
        setActiveTab(tab);
        document.getElementById('search-filter').value = '';
    },

    setView: async function(view, filtered_data = null) {
        let storage = await Storage.get();
        let view_render = document.getElementById('view-render');
        let search_filter = document.getElementById('search-filter');

        console.log(storage);

        search_filter.style.display = 'none';

        switch(view) {
            case SHOWS:
                view_render.innerHTML = DOM.render(SHOWS, filtered_data || storage.shows);
                document.querySelectorAll('[data-show-delete]').forEach((e) => {
                    e.addEventListener('click', App.deleteShow);
                });
                search_filter.style.display = 'block';
                break;

            case MOVIES:
                view_render.innerHTML = DOM.render(MOVIES, filtered_data || storage.movies);
                document.querySelectorAll('[data-movie-delete]').forEach((e) => {
                    e.addEventListener('click', App.deleteMovie);
                });
                search_filter.style.display = 'block';
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