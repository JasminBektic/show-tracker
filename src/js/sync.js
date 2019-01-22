Sync = {
    heartbeat: function() {
        setInterval(Sync.activate, SYNC_TIME);
    },

    activate: async function() {
        let storage = await Storage.get();
console.log(storage);
console.log((Date.now() - storage.synced) / 1000);


        // Check if sync is needed, synced_time timestamp in storage object
        // Sync every 2 hours or trigger on specific datetime
        // Clone current storage shows then activate sync where limit will be 40req/sec

        // if ((storage.synced - Date.now()) / 1000/60/60 > 2) {  // sync every 2 hours
        if ((Date.now() - storage.synced) / 1000 > 10) {  // sync every 2 hours
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
            // TODO: limit requests to 40
            let temp_sync = storage.sync_ids.slice();
            for (let sw of temp_sync) {
                let show = await Api.getById(sw.id);
                show.imdb_id = sw.imdb_id;
                storage.shows.push(Storage.prepareShowStructure(show));
                storage.sync_ids.shift();
            }
            
            // Sync all or partial data, depend on request limit
            if (storage.sync_ids.length == 0) {
                storage.synced = Date.now();
                await Storage.sync(storage);
            } else {
                for (let show of storage.shows) {
                    await Storage.insert(show);
                }
            }
        }
    }
}

Sync.heartbeat();