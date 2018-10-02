var STORAGE_IMDB = 'imdb_ids';

function insertIntoStorage(key, data) {
    chrome.storage.sync.set({[key]: data}, () => {
        return true;
    });
}

async function deleteFromStorage(key, imdb_id) {
    imdb_ids = await getFromStorage([key]);
    imdb_ids = imdb_ids.filter((id) => id !== imdb_id);

    chrome.storage.sync.set({[key]: imdb_ids}, () => {
        return true;
    });
}

function getFromStorage(key) {
    return new Promise(resolve => {
        chrome.storage.sync.get(key, (res) => {
            if(res[key] === undefined) {
                resolve([]);
            }
    
            resolve(res[key]);
        });
    });
}