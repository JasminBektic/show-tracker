function dateFormat(date) {
    var options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    var date = new Date(date);

    return date.toLocaleDateString('en-US', options);
}

function message(text) {
    alert(text);
}