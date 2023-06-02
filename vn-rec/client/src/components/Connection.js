export function getUser(username) {
    var query = 'https://api.vndb.org/kana/user?q=' + username;
    var request = new XMLHttpRequest();
    request.open('GET', query, true);
    request.send()

    request.onload = function () {
        console.log(this.response);
        var data = JSON.parse(this.response);

        console.log(data)
    }
}