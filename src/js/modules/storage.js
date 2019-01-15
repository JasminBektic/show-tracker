/**
 * storage json format:
 * {
 *   shows: [],
 *   movies: [],
 *   synced: false,
 * }
 */
var Storage = (function() {
    'use strict';

    var STORAGE_KEY = 'show_tracker';
  
    /* =================== private methods ================= */

  
    /* =================== public methods ================== */
    function init() {
    
    }

    // function insertTvShow(show) {
    //     var data = get();
    //     data.shows.push(show);

    //     chrome.storage.sync.set({[STORAGE_KEY]: data}, () => {
    //         return true;
    //     });
    // }

    // function insertMovie(movie) {
    //     var data = get();
    //     data.movies.push(movie);

    //     chrome.storage.sync.set({[STORAGE_KEY]: data}, () => {
    //         return true;
    //     });
    // }

    function insert(showOrMovie, key) {
        var data = get();
        data[key].push(showOrMovie);

        chrome.storage.sync.set({[STORAGE_KEY]: data}, () => {
            return true;
        });
    }

    function destroy(imdb_id) {
        var data = get();
        imdb_ids = imdb_ids.filter((id) => id !== imdb_id);
    
        chrome.storage.sync.set({[STORAGE_KEY]: imdb_ids}, () => {
            return true;
        });
    }

    function get() {
        return new Promise(resolve => {
            chrome.storage.sync.get(STORAGE_KEY, (res) => {
                if(res[STORAGE_KEY] === undefined) {
                    resolve([]);
                }
        
                resolve(res[STORAGE_KEY]);
            });
        });
    }
  
    /* =============== export public methods =============== */
    return {
      insert: insert,
    //   insertMovie: insertMovie,
    //   insertTvShow: insertTvShow,
      destroy: destroy,
      get: get
    };
}());