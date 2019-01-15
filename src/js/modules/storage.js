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
    var key = '';
  
    /* =================== private methods ================= */

  
    /* =================== public methods ================== */
    function setKey(k) {
        key = k
    }

    async function insert(show) {
        var data = await get();
        data[key].push(show);

        chrome.storage.sync.set({[STORAGE_KEY]: data}, () => {
            return true;
        });
    }

    async function destroy(imdb_id) {
        var data = await get();
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

    function getConfig() {
        // TODO: sync in storage from config.json
        // hardcoded for now
        return {
            "api": {
                "host": "https://api.themoviedb.org/3/",
                "key": "f2e03364520223af458cf73b7da1e8c7",
                "base_url": "https://image.tmdb.org/t/p/"
            },
        }
    }
  
    /* =============== export public methods =============== */
    return {
      insert: insert,
      destroy: destroy,
      get: get,
      getConfig: getConfig,
      setKey: setKey
    };
}());