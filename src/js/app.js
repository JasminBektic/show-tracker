var config = {};
var render = {};
var imdb_ids = [];

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

function init(view) {
    config = fetch("/config.json")
            .then(response => { 
                return response.json(); 
            })
            .then(async function(data) {
                config = data; 

                // insertIntoStorage(STORAGE_IMDB, config.imdb_ids) // tv shows seeders

                imdb_ids = await Storage.get();
               
                // return config; 
            })

    Promise.all([config])
            .then(() => {
                var services = [];

                imdb_ids.forEach(imdbId => {
                    services.push(fetch(config.api_host+ "find/" +imdbId+ "?api_key=" +config.api_key+ "&external_source=imdb_id")
                                    .then(function(response) {
                                        // console.log(response.json());
                                        return response.json();
                                    })
                                );
                });

                return Promise.all(services);
            })
            .then(response => {
                var services = [];

                response.forEach(res => {
                    res.movie_results.forEach(show => {
                        services.push(fetch(config.api_host+ "tv/" +show.id+ "?api_key=" +config.api_key)
                                        .then(function(response) {
                                            console.log(response.json());
                                            return response.json();
                                        })
                                    );
                    });
                });

                return Promise.all(services);
            })
            .then(response => {

                // TODO: render under one loop iteration and sort array by date
                render.today_shows = renderTodayShows(response);
                render.next_seven_days = renderNextSevenDaysShows(response);
                render.air_dates = renderAirDate(response);

                if (view == 'my_shows') {
                    document.getElementById('view-render').innerHTML = render.air_dates;
                    document.querySelectorAll('[data-show-delete]').forEach((e) => {
                        e.addEventListener('click', deleteShow);
                    });
                } else {
                    document.getElementById('view-render').innerHTML = render.today_shows;
                    document.getElementById('view-render').innerHTML += render.next_seven_days;
                }
            })
            .catch(function(error) {
                console.log(error);
            });
}


function dateFormat(date) {
    var options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    var date = new Date(date);

    return date.toLocaleDateString('en-US', options);
}


function deleteShow() {
    let show_id = this.getAttribute('data-show-delete');
    
    fetch(config.api_host+ "tv/" +show_id+ "/external_ids?api_key=" +config.api_key)
        .then(response => { 
            return response.json(); 
        })
        .then(async function(data) {
            deleteFromStorage(STORAGE_IMDB, data.imdb_id);

            init('my_shows');
        });
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


function renderTodayShows(shows) {
    var todayShows = '',
        currentDate = new Date().setHours(0,0,0,0);

    shows.forEach(show => {
        var showDate = new Date(show.next_episode_to_air ? show.next_episode_to_air.air_date : null).setHours(0,0,0,0);

        if (currentDate == showDate) {
            todayShows += `<div>
                                <h3>${show.name}</h3>
                                <img src='${config.api_base_url}w92/${show.poster_path}'>
                                <p>Rating: ${show.vote_average} </p>
                           </div>`;
        }
    });

    // todayShows = todayShows ? '<h4><u>Today</u></h4>' + todayShows : '';

    return todayShows;
}


function renderNextSevenDaysShows(shows) {
    var nextSevenDaysShows = '',
        currentDate = new Date();

    shows.forEach(show => {
        var showDate = new Date(show.next_episode_to_air ? show.next_episode_to_air.air_date : 0);

        if (Math.abs(currentDate - showDate) / (1000*60*60) < 7*24) {
            nextSevenDaysShows += `<div class='d-flex pb-2'>
                                        <img src='${config.api_base_url}w45/${show.poster_path}'>
                                        <span class='pl-1'>
                                            <h6>${show.name}</h6>
                                            <div class='small'>Rating: ${show.vote_average} </div>
                                            <div class='small'>Next episode: ${(show.next_episode_to_air ? dateFormat(show.next_episode_to_air.air_date) : '')} </div>
                                        </span>
                                    </div>`;
        }

    });

    nextSevenDaysShows = nextSevenDaysShows ? '<h4><u>In next week</u></h4>' + nextSevenDaysShows : '';

    return nextSevenDaysShows;
}

function renderAirDate(shows) {
    var airDates = '';

    shows.forEach(show => {
        let genres = '';

        show.genres.forEach((genre) => {
            genres += `| ${genre.name} `;
        });
        genres = genres.slice(2);

        airDates += `<div class='mb-3 d-flex justify-content-between'>
                        <div>
                            <div>
                                <img src='${config.api_base_url}w185/${show.backdrop_path}'>
                            </div>
                            <div>
                                <h6 class='m-0'>${show.name}</h6>
                                <div class='small'>${genres}</div>
                                <div class='small font-italic'><span class='glyphicon glyphicon-star'></span>${show.vote_average} </div>
                                <div class='small'>Runtime: ${show.episode_run_time[0]} minutes</div>
                                <div class='small'>Last episode: S${show.last_episode_to_air.season_number}E${show.last_episode_to_air.episode_number}</div>
                                <div class='small font-italic'>Next episode: ${(show.next_episode_to_air ? dateFormat(show.next_episode_to_air.air_date) : 'N/A')} </div>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="close" data-show-delete=${show.id} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                     </div>`;
    });

    // airDates = airDates ? '<h4><u>Air dates</u></h4>' + airDates : '';

    return airDates;
}