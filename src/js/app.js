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

// var storage = Storage.get();
// console.log(storage);

async function init(view) {
    let storage = await Storage.get();
    let config = Storage.getConfig();

    // TODO: render under one loop iteration and sort array by date
    render.today_shows = DOM.renderTodayShows(storage.shows);
    render.next_seven_days = DOM.renderNextSevenDaysShows(storage.shows);
    render.air_dates = DOM.renderShows(storage.shows);

    if (view == 'my_shows') {
        document.getElementById('view-render').innerHTML = render.air_dates;
        document.querySelectorAll('[data-show-delete]').forEach((e) => {
            e.addEventListener('click', deleteShow);
        });
    } else {
        document.getElementById('view-render').innerHTML = render.today_shows;
        document.getElementById('view-render').innerHTML += render.next_seven_days;
    }
}


async function deleteShow() {
    let imdb_id = this.getAttribute('data-show-delete');

    Storage.setKey('shows');
    await Storage.destroy(imdb_id);

    init('my_shows');
}


function renderView() {
    let tab = this;
    
    switch(tab.getAttribute('data-tab')) {
        case 'incoming':
            document.getElementById('view-render').innerHTML = render.today_shows;
            document.getElementById('view-render').innerHTML += render.next_seven_days;
            break;

        case 'my_shows':
            document.getElementById('view-render').innerHTML = render.air_dates;
            document.querySelectorAll('[data-show-delete]').forEach((e) => {
                e.addEventListener('click', deleteShow);
            });
            break;
    }

    document.querySelectorAll('[data-tab]').forEach((e) => {
        e.classList.remove('active');
    });
    tab.classList.add('active');
}