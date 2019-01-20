Sync = {
    heartbeat: function() {
        setInterval(Sync.activate, SYNC_TIME);
    },

    activate: async function() {
        let storage = await Storage.get();

        // Check if sync is needed, synced_time timestamp in storage object
        // Sync every 2 hours or trigger on specific datetime
        // Clone current storage shows then activate sync where limit will be 40req/sec

        await Storage.setKey(SHOWS)
                     .destroyMultiple();
        
        storage.shows.forEach(async function(show) {
            let test = await Api.getById(show.id);
            // console.log(test);
        });
    }
}

// Sync.heartbeat();