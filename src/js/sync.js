// Important: Api have limit of 40 requests per max 10 sec
Sync = {
    heartbeat: function() {
        setInterval(Sync.activate, SYNC_TIME);
    },

    activate: async function() {
        let storage = await Storage.get();

        if ((Date.now() - storage.synced) / 1000/60/60 > 2) {  // sync every 2+ hours
            // Prepare sync ids
            if (storage.sync_ids.length == 0) {
                storage.shows.forEach((show) => {
                    storage.sync_ids.push({
                        id: show.id,
                        imdb_id: show.imdb_id
                    });
                });
                storage.shows = [];
            }

            Storage.setKey(SHOWS);

            // Get new show data
            let temp_sync = storage.sync_ids.slice();
            let request_counter = 1;

            for (let sw of temp_sync) {
                request_counter++;
                if (request_counter >= REQUEST_LIMIT) {
                    continue;
                }

                let show = await Api.getById(sw.id);

                // Ignore response if it's not valid
                // code#25 - request limit
                // code#34 - not found
                if (show.status_code == 25 || show.status_code == 34) {
                    continue;
                }

                show.imdb_id = sw.imdb_id;
                storage.shows.push(Storage.prepareShowStructure(show));
                storage.sync_ids.shift();
            }
            
            // Sync all or partial data, depend on request limit
            if (storage.sync_ids.length == 0) {
                storage.synced = Date.now();
            }

            await Storage.sync(storage);
        }
    }
}

Sync.heartbeat();