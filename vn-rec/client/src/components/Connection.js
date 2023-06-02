export function getUser(username, callback) {
    var query = 'https://api.vndb.org/kana/user?q=' + username;
    var request = new XMLHttpRequest();
    request.open('GET', query, true);
    request.send()

    request.onload = function () {
        console.log(this.response);
        const data = JSON.parse(this.response);

        callback(data[username]);
    }
}