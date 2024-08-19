export function getSuggestedVNS(tags, callback) {
    var query = 'https://api.vndb.org/kana/vn';
    var request = new XMLHttpRequest();
    request.open('POST', query, true);
    request.setRequestHeader('Content-Type', 'application/json');

    const reqArgs = {
        filters: ["or"
        , ["tag","=",tags[0]]
        , ["tag","=",tags[1]]
        , ["tag","=",tags[2]]
        , ["tag","=",tags[3]]
        , ["tag","=",tags[4]]
        , ["tag","=",tags[5]]
        , ["tag","=",tags[6]]
        , ["tag","=",tags[7]]
        , ["tag","=",tags[8]]
        , ["tag","=",tags[9]] ],
        fields: "id, title, length, tags.name, description, rating, image.url, popularity",
        results: 10
    };

    request.send(JSON.stringify(reqArgs));

    request.onload = function () {
        const data = JSON.parse(this.response);
        callback(data);
    }
}

// returns the user's vndb id
function getUserID(username, callback) {
    var query = 'https://api.vndb.org/kana/user?q=' + username;
    var request = new XMLHttpRequest();

    request.open('GET', query, true);
    request.send();

    request.onload = function () {
        const data = JSON.parse(this.response);
        if (data[username] === null) {
            callback("notarealid");
        } else {
            callback(data[username].id);
        }
    }
}

// returns a list of the user's rated visual novels
export function getUserList(username, callback) {
    var query = 'https://api.vndb.org/kana/ulist';
    var request = new XMLHttpRequest();
    getUserID(username, function(userID) {
        request.open('POST', query, true);
        request.setRequestHeader('Content-Type', 'application/json');

        const reqArgs = {
            user: userID.toString(),
            fields: "id, vote, vn.title, vn.tags.name",
            filters: ["label", "=", 7],
            sort: "vote",
            reverse: true
        };

        request.send(JSON.stringify(reqArgs));

        request.onload = function () {
            if (userID === "notarealid") {
                callback(null);
            } else {
                const data = JSON.parse(this.response);
                callback(data.results);
            }
        }
    })
}