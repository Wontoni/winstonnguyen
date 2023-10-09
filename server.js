const http = require('http');
const url = require('url');
const port = 8080;
const GET = "GET";
const POST = "POST";

const utils = require('./COMP4537/labs/3/modules/utils')

let requestCount = 0;
let dictionary = [
];

function addDefinition(word, definition) {
	requestCount++;
	for (let i = 0; i < dictionary.length; i++) {
		if (dictionary[i].word === word) {
			// Word exists, send message that word is not added
			return false;
		}
	}

	dictionary.push({
		word: word,
		definition: definition,
	});
	return true;
}

function searchDefinition(word) {
	requestCount++;
	for (let i = 0; i < dictionary.length; i++) {
		if (dictionary[i].word === word) {
			// Word exists, send back the definition
			return dictionary[i].definition;
		}
	}
	//returns false if the word is not found in dictionary
	return false;
}

function inputCheck(word) {
	let hasNumber = /\d/;
	if (!word.trim() || hasNumber.test(word)) {
		console.log("word after trim: " + word.trim());
		requestCount++;
		return true;
	} else {
		return false;
	}
}

http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    });

    const labFourApiRoute = "/COMP4537/labs/4/API/v1/";

    let q = url.parse(req.url, true);
    if(q.pathname == "/") {
        console.log("GOT ROOT");
        res.end("HOMEPAGE")
    }
    else if(q.pathname == "/COMP4537/labs/3/getDate/") {
        let text = utils.getDate(q.query["name"]);
        res.end(`<div style=color:blue>` + text + `</div>`)
    } 
    else if (req.method === GET && q.pathname === labFourApiRoute) {
        console.log("GET");
        console.log("Words in Dictionary:");
        for (let i = 0; i < dictionary.length; i++) {
            console.log(
                "Word: " +
                    dictionary[i].word +
                    " Definition: " +
                    dictionary[i].definition
            );
        }

        const q = url.parse(req.url, true);

        // Search for word in dictionary. Sends an appropriate response
        let result = searchDefinition(q.query["word"]);
        if (result) {
            res.end("Request #" + requestCount + "<br><br>" + result);
        } else {
            res.end(
                "Request #" +
                    requestCount +
                    "<br><br>The word '" +
                    q.query["word"] +
                    "' is not found!"
            );
        }
    } 
    else if (req.method === POST && req.url === labFourApiRoute) {
        console.log("POST");
        let body = "";

        req.on("data", function (chunk) {
            if (chunk != null) {
                body += chunk;
            }
        });

        req.on("end", function () {
            let q = url.parse(body, true);

            //TODO!! check for empty string after removing spaces and if the word contains any digits
            let hasWrongInput = inputCheck(q.query.word);
            if (hasWrongInput) {
                res.end(
                    "Request #" +
                        requestCount +
                        "<br><br>Unsuccessful: The entered word is either blank, empty or has numbers in it!"
                );
                return;
            }

            // Adds word to dictionary if it does not exist. Sends an appropriate status message
            let result = addDefinition(q.query.word, q.query.definition);
            if (result) {
                res.end(
                    "Request #" +
                        requestCount +
                        ": (Total entries in your dictionary: " +
                        dictionary.length +
                        ")<br><br>New entry recorded:" +
                        '<br><br>"' +
                        q.query.word +
                        ": " +
                        q.query.definition +
                        '"'
                );
            } else {
                res.end(
                    "Request #" +
                        requestCount +
                        "<br><br>Unsuccessful: The new word already exists in the dictionary!"
                );
            }
        });
    } else {
        console.log("URL: " + req.url);
        console.log("PATHNAME: " + q.pathname);
        console.log("METHOD: " + req.method);
        res.end("PAGE NOT FOUND");
    }
    // else {
    //     res.end("Page not found")
    // }
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