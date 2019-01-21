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
            sync_ids: [],
            synced: Date.now()
        }
    }

    /* =================== public methods ================== */
    function setKey(k) {
        key = k
        return this;
    }

    function getKey() {
        return key;
    }

    function prepareShowStructure(show) {
        return {
            id: show.id,
            name: show.name,
            backdrop_path: show.backdrop_path,
            genres: show.genres,
            episode_run_time: show.episode_run_time,
            poster_path: show.poster_path,
            next_episode_to_air: show.next_episode_to_air,
            last_episode_to_air: show.last_episode_to_air,
            vote_average: show.vote_average,
            imdb_id: show.imdb_id
        };
    }

    function prepareMovieStructure(show) {
        return {
            id: show.id,
            name: show.title,
            backdrop_path: show.backdrop_path,
            genres: show.genres,
            release_date: show.release_date,
            vote_average: show.vote_average,
            imdb_id: show.imdb_id
        };
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

    async function destroyMultiple() {
        let data = await get();
        data[getKey()] = [];

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

    function sync(data) {
        chrome.storage.local.set({[STORAGE_KEY]: data}, () => {
            return true;
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
      destroyMultiple: destroyMultiple,
      get: get,
      getConfig: getConfig,
      setKey: setKey,
      getKey: getKey,
      prepareShowStructure: prepareShowStructure,
      prepareMovieStructure: prepareMovieStructure,
      sync: sync
    };
}());