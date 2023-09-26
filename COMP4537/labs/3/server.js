const http = require('http');
const url = require('url');

const utils = require('./modules/utils.js')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});

    let q = url.parse(req.url, true);
    if(q.pathname == "/") {
        res.end("you're boring")
    }
    else if(q.pathname == "/getDate/") {
        res.end(utils.getDate(q.query["name"]));
    }
}).listen(8888);


console.log('Server is running and listening');