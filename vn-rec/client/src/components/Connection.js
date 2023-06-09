function getSuggestedVNS(tags) {
        
}

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
            reverse: true,
            results: 10
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