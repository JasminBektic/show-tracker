var Api = (function() {
    'use strict';

    var config = Storage.getConfig();

    /* =================== private methods ================= */

  
    /* =================== public methods ================== */
    function getByImdb(imdb_id) {
        var url = `${config.api.host}find/${imdb_id}?api_key=${config.api.key}&external_source=imdb_id`;
     
        return new Promise(resolve => {
            fetch(url)
                .then(function(response) {
                    return resolve(response.json());
                });
        });
    }

    function getById(id) {
        var url = `${config.api.host}tv/${id}?api_key=${config.api.key}`;
     
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
            data: data.tv_movies[0],
            key_type: 'movies'
        }
            :
        {
            data: data.tv_results[0],
            key_type: 'shows'
        };
    }
  
    /* =============== export public methods =============== */
    return {
        getById: getById,
        getByImdb: getByImdb,
        imdbResponsePurifier: imdbResponsePurifier
    };
}());