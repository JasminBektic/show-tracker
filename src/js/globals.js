const SHOWS = 'shows';
const MOVIES = 'movies';
const IMDB_ADD_BUTTON = 'imdbAddButton';
const TODAY_SHOWS = 'todayShows';
const SEVEN_DAYS_SHOWS = 'nextSevenDaysShows';


function dateFormat(date) {
    var options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    var date = new Date(date);

    return date.toLocaleDateString('en-US', options);
}

function message(text) {
    alert(text);
}