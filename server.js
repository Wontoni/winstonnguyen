const http = require('http');
const url = require('url');
const port = 8080;

const utils = require('./COMP4537/labs/3/modules/utils')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});

    let q = url.parse(req.url, true);
    if(q.pathname == "/") {
        res.end()
    }
    else if(q.pathname == "/COMP4537/labs/3/getDate/") {
        let text = utils.getDate(q.query["name"]);
        res.end(`<div style=color:blue>` + text + `</div>`)
    } else {
        res.end("Page not found")
    }
}).listen(port);

console.log("Application listening on port " + port);

















// USING EXPRESS -> Switch later

// const express = require('express');
// const port = process.env.PORT || 8080;

// const app = express();

// app.use(express.urlencoded({extended: false}));


// app.get('/', (req,res) => { // Homepage
//     res.sendFile("index.html", { root: __dirname })
// }); 


// // app.get("*", (req,res) => { // 404 Catch All
// // 	res.status(404);
// // 	res.render("404")
// // });

// app.use(express.static(__dirname));

// app.listen(port, () => {
// 	console.log("Node application listening on port " + port);
// }); 