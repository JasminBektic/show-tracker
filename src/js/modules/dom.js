let DOM = (function() {
    'use strict';

    /* =================== private methods ================= */

    /* =================== public methods ================== */
    function renderImdbAddButtonWrapper() {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'imdb-container'); 
        wrapper.style.background = 'green';
    
        return wrapper;
    }

    function renderImdbAddButton() {
        var button = document.createElement('button');
        button.innerHTML = `Add`;
        button.setAttribute('class', 'test-class'); 
        button.style.color = 'red';
        button.addEventListener('click', bindAddClickEvent);
    
        return button;
    }

    function renderTodayShows(shows) {
        var todayShows = '',
            currentDate = new Date().setHours(0,0,0,0);
    
        shows.forEach(show => {
            var showDate = new Date(show.next_episode_to_air ? show.next_episode_to_air.air_date : null).setHours(0,0,0,0);
    
            if (currentDate == showDate) {
                todayShows += `<div>
                                    <h3>${show.name}</h3>
                                    <img src='${config.api.base_url}w92/${show.poster_path}'>
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
                                            <img src='${config.api.base_url}w45/${show.poster_path}'>
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

    function renderShows(shows) {
        var all_shows = '';
    
        shows.forEach(show => {
            let genres = '';
    
            show.genres.forEach((genre) => {
                genres += `| ${genre.name} `;
            });
            genres = genres.slice(2);
    
            all_shows += `<div class='mb-3 d-flex justify-content-between'>
                            <div>
                                <div>
                                    <img src='${config.api.base_url}w185/${show.backdrop_path}'>
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
                                <button type="button" class="close" data-show-delete=${show.imdb_id} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>`;
        });
    
        // airDates = airDates ? '<h4><u>Air dates</u></h4>' + airDates : '';
    
        return all_shows;
    }
  
    /* =============== export public methods =============== */
    return {
        renderTodayShows: renderTodayShows,
        renderNextSevenDaysShows: renderNextSevenDaysShows,
        renderShows: renderShows,
        renderImdbAddButtonWrapper: renderImdbAddButtonWrapper,
        renderImdbAddButton: renderImdbAddButton
    };
}());