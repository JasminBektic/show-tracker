var Api = (function() {
    'use strict';

    let config = Storage.getConfig();

    /* =================== private methods ================= */
    function getFindByImdbUrl(imdb_id) {
        return `${config.api.host}find/${imdb_id}?api_key=${config.api.key}&external_source=imdb_id`;
    }

    function getFindByIdUrl(id) {
        return `${config.api.host}movie/${id}?api_key=${config.api.key}`;
    }

    /* =================== public methods ================== */
    function getByImdb(imdb_id) {
        let url = getFindByImdbUrl(imdb_id);
     
        return new Promise(resolve => {
            fetch(url)
                .then(function(response) {
                    return resolve(response.json());
                });
        });
    }

    function getById(id) {
        let url = getFindByIdUrl(id);
     
        return new Promise(resolve => {
            fetch(url)
                .then(function(response) {
                    return resolve(response.json());
                });
        });
    }

    function imdbResponsePurifier(data) {
        return data.tv_results.length == 0 ? 
        {
            data: data.movie_results[0],
            key_type: MOVIES
        }
            :
        {
            data: data.tv_results[0],
            key_type: SHOWS
        };
    }
  
    /* =============== export public methods =============== */
    return {
        getById: getById,
        getByImdb: getByImdb,
        imdbResponsePurifier: imdbResponsePurifier
    };
}());