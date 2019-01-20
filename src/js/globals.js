const SHOWS = 'shows';
const MOVIES = 'movies';
const IMDB_ADD_BUTTON = 'imdbAddButton';
const TODAY_SHOWS = 'todayShows';
const SEVEN_DAYS_SHOWS = 'nextSevenDaysShows';
const SYNC_TIME = 5000;


function dateFormat(date) {
    var options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    var date = new Date(date);

    return date.toLocaleDateString('en-US', options);
}

function setActiveTab(tab) {
    document.querySelectorAll('[data-tab]').forEach((e) => {
        e.classList.remove('active');
    });
    tab.classList.add('active');
}

function getActiveTab() {
    let active_tab = '';

    document.querySelectorAll('[data-tab]').forEach((e) => {
        if(e.className.includes('active')) {
            active_tab = e.getAttribute('data-tab');
        }
    });

    return active_tab;
}

function message(text) {
    alert(text);
}