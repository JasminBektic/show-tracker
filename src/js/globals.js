const SHOWS = 'shows';
const MOVIES = 'movies';
const IMDB_ADD_BUTTON = 'imdbAddButton';
const TODAY_SHOWS = 'todayShows';
const SEVEN_DAYS_SHOWS = 'nextSevenDaysShows';
const TEXT_MARKER = 'textMarker';
const SYNC_TIME = 10000;
const REQUEST_LIMIT = 40;


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
        e.classList.remove('tab-active');
    });
    tab.classList.add('tab-active');
}

function getActiveTab() {
    let active_tab = '';

    document.querySelectorAll('[data-tab]').forEach((e) => {
        if(e.className.includes('tab-active')) {
            active_tab = e.getAttribute('data-tab');
        }
    });

    return active_tab;
}

function isContainSpecialChar(str){
    return /[~`!#$%\^&*+=\-\[\]\\';.,/{}|\\":<>\?]/g.test(str);
}

function message(text) {
    alert(text);
}