

var node = document.createElement('div'),
    button = document.createElement('button');

button.addEventListener('click', async function () {
    var url = window.location.pathname,
        imdb_id = url.split('/')[2];

        var imdb_ids = await getFromStorage(STORAGE_IMDB);
        console.log(Storage);
        if (imdb_ids.includes(imdb_id)) {
            alert('You already added this TV show.');
            return;
        }

        imdb_ids.push(imdb_id);
        Storage.insert(STORAGE_IMDB, imdb_ids);

        alert('TV show successfully added.');
});

button.append('Add');

node.classList.add('imdb-container');  
node.append(button);

document.getElementById('wrapper').appendChild(node);

