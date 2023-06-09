export function getSuggestedVNS(tags, callback) {
    var query = 'https://api.vndb.org/kana/vn';
    var request = new XMLHttpRequest();
    request.open('POST', query, true);
    request.setRequestHeader('Content-Type', 'application/json');

    console.log(tags);

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
        fields: "title, length, tags.name, image.url, popularity",
        results: 10
    };

    request.send(JSON.stringify(reqArgs));

    request.onload = function () {
        const data = JSON.parse(this.response);
        callback(data);
        // let count = 0;
        // console.log(data.results);
        // for (let tag of tags) {
        //     for (let otherTag of data.results[0].tags) {
        //         if (tag === otherTag.name) {
        //             count++;
        //         }
        //     }
        // }
        // console.log(((count / tags.length) * 100));
        // if (((count / tags.length) * 100) >= 50) {
        //     console.log("lol");
        //     topTen[data.results.title] = (count / tags.length) * 100;
        // }
        // if (Object.keys(topTen).length === 10) {
        //     callback(topTen);
        // }
        // getSuggestedVNS(tags, topTen);
    }
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