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

        if (storage.sync_ids.length > 0) {
           
        }

        // if ((storage.synced - Date.now()) / 1000/60/60 > 2) {  // sync every 2 hours
        if ((Date.now() - storage.synced) / 1000 > 5) {  // sync every 2 hours
            // let storage = await Storage.get();

            if (storage.sync_ids.length == 0) {
                await Storage.setKey(SHOWS)
                             .destroyMultiple();

                storage.shows.forEach((show) => {
                    storage.sync_ids.push({
                        id: show.id,
                        imdb_id: show.imdb_id
                    });
                });

                let temp_sync = storage.sync_ids.slice();

                temp_sync.forEach(async (sw) => {
                    let show = await Api.getById(sw.id);
                    show.imdb_id = sw.imdb_id
                    await Storage.insert(show);
                    storage.sync_ids.shift();
                });

                storage.synced = Date.now();

                await Storage.sync(storage);
            }
        }
    }
}

Sync.heartbeat();