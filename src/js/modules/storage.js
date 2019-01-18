/**
 * storage json format:
 * {
 *   shows: [],
 *   movies: [],
 *   synced: false,
 * }
 * 
 * Reference to why switch from storage.sync to storage.local:
 * https://stackoverflow.com/questions/33015723/unchecked-runtime-lasterror-while-running-storage-set-quota-bytes-per-item-quot
 */
var Storage = (function() {
    'use strict';

    var STORAGE_KEY = 'show_tracker';
    var key = '';
  
    /* =================== private methods ================= */
    function initStructure() {
        return {
            shows: [],
            movies: [],
            synced: false
        }
    }

    /* =================== public methods ================== */
    function setKey(k) {
        key = k
    }

    function getKey() {
        return key;
    }

    async function insert(show) {
        let data = await get();
        data[getKey()].push(show);

        chrome.storage.local.set({[STORAGE_KEY]: data}, () => {
            return true;
        });
    }

    async function destroy(imdb_id) {
        let data = await get();
        data[getKey()] = data[getKey()].filter((show) => show.imdb_id != imdb_id);
    
        chrome.storage.local.set({[STORAGE_KEY]: data}, () => {
            return true;
        });
    }

    function get() {
        return new Promise(resolve => {
            chrome.storage.local.get(STORAGE_KEY, (res) => {
                if(res[STORAGE_KEY] === undefined) {
                    resolve(initStructure());
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
      setKey: setKey,
      getKey: getKey
    };
}());