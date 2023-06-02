const express = require("express")
const app = express()
const PORT = 4000

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
});