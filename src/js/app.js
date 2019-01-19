var render = {};

document.addEventListener('DOMContentLoaded', init);
document.querySelectorAll('[data-tab]').forEach((e) => {
    e.addEventListener('click', renderView);
});

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

var storage = Storage.get();
console.log(storage);

async function init(view) {
    let storage = await Storage.get();
    let config = Storage.getConfig();

    // TODO: render under one loop iteration and sort array by date
    render.today_shows = DOM.render(TODAY_SHOWS, storage.shows);
    render.next_seven_days = DOM.render(SEVEN_DAYS_SHOWS, storage.shows);
    render.air_dates = DOM.render(SHOWS, storage.shows);
    render.movies = DOM.render(MOVIES, storage.movies);

    switch(view) {
        case SHOWS:
            document.getElementById('view-render').innerHTML = render.air_dates;
            document.querySelectorAll('[data-show-delete]').forEach((e) => {
                e.addEventListener('click', deleteShow);
            });
            break;

        case MOVIES:
            document.getElementById('view-render').innerHTML = render.movies;
            // document.querySelectorAll('[data-show-delete]').forEach((e) => {
            //     e.addEventListener('click', deleteShow);
            // });
            break;

        default:
            document.getElementById('view-render').innerHTML = render.today_shows;
            document.getElementById('view-render').innerHTML += render.next_seven_days;
    }
}


async function deleteShow() {
    let imdb_id = this.getAttribute('data-show-delete');

    Storage.setKey('shows');
    await Storage.destroy(imdb_id);

    init(SHOWS);
}


function renderView() {
    let tab = this;
    
    switch(tab.getAttribute('data-tab')) {
        case SHOWS:
            document.getElementById('view-render').innerHTML = render.air_dates;
            document.querySelectorAll('[data-show-delete]').forEach((e) => {
                e.addEventListener('click', deleteShow);
            });
            break;

        case MOVIES:
            document.getElementById('view-render').innerHTML = render.movies;
            break;

        default:
            document.getElementById('view-render').innerHTML = render.today_shows;
            document.getElementById('view-render').innerHTML += render.next_seven_days;
    }

    document.querySelectorAll('[data-tab]').forEach((e) => {
        e.classList.remove('active');
    });
    tab.classList.add('active');
}