const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 8080;
const GET = "GET";
const POST = "POST";

const utils = require('./COMP4537/labs/3/modules/utils')

const database = require('./COMP4537/labs/5/database/databaseConnection');
const db_utils = require('./COMP4537/labs/5/database/db_utils');
const db_queries = require('./COMP4537/labs/5/database/queries.js');
db_utils.printMySQLVersion();

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

http.createServer(async function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    });

    const labFourApiRoute = "/COMP4537/labs/4/API/v1/";
    const labFiveApiRoute = "/COMP4537/labs/5/API/v1/sql/";

    let q = url.parse(req.url, true);
    if(q.pathname == "/") {
        res.end("HOMEPAGE")
    }
    else if(q.pathname == "/COMP4537/labs/3/getDate/") {
        let text = utils.getDate(q.query["name"]);
        res.end(`<div style=color:blue>` + text + `</div>`)
    }  
    else if (q.pathname == "/COMP4537/labs/4/search.html"){
        fs.readFile('./COMP4537/Labs/4/search.html', function(error, html) {
            if (error) {
                throw error
            }
            res.write(html)
            res.end()
        })
    }  
    else if (q.pathname == "/COMP4537/labs/4/store.html"){
        fs.readFile('./COMP4537/Labs/4/store.html', function(error, html) {
            if (error) {
                throw error
            }
            res.write(html)
            res.end()
        })
    }  
    else if (q.pathname == "/COMP4537/labs/4/index.html"){
        fs.readFile('./COMP4537/Labs/4/index.html', function(error, html) {
            if (error) {
                throw error
            }
            res.write(html)
            res.end()
        })
    }
    else if (req.method === GET && q.pathname === labFourApiRoute) {
        for (let i = 0; i < dictionary.length; i++) {
            console.log(
                "Word: " +
                    dictionary[i].word +
                    " Definition: " +
                    dictionary[i].definition
            );
        }

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
    } 
    else if (q.pathname == "/COMP4537/labs/5/index.html") {
    fs.readFile("./COMP4537/labs/5/index.html", function (error, html) {
        if (error) {
            throw error;
        }
        res.write(html);
        res.end();
    });
    } 
    else if (req.method === POST && q.pathname === labFiveApiRoute + "addRows/") {
        // http://localhost:8080/COMP4537/labs/5/API/v1/sql/addRows/
        console.log("ADD ROWS");
        const success = db_queries.addPatients();

        if (success) {
            console.log("Successfully added patients");
            res.end("Succesfully added patients");
        } else {
            console.log(success);
            res.end(success);
            res.end("Error adding patients");
        }
    } 
    else if (req.method === GET && q.pathname === labFiveApiRoute) {
        let query = "" + q.query["query"];
        console.log("server side query recevied is: " + query);

        let result = await db_queries.labFiveQuery(query);
        if (result) {
            console.log(result);
            res.end(JSON.stringify(result));
        } else {
            res.end("Error in running select query");
        }
    } 
    else if (req.method === POST && q.pathname === labFiveApiRoute) {
        let body = "";

        req.on("data", function (chunk) {
            if (chunk != null) {
                body += chunk;
            }
        });

        req.on("end", async function () {
            let q = url.parse(body, true);

            let result = await db_queries.labFiveQuery(q.query.query);
            if (result.success) {
                console.log(result);
                res.end("Succesfully inserted values into the database");
            } else {
                res.end(result.result.sqlMessage);
            }
        });
    } 
    else {
        console.log("URL: " + req.url);
        console.log("PATHNAME: " + q.pathname);
        console.log("METHOD: " + req.method);
        res.end("PAGE NOT FOUND");
    }
    })
    .listen(port);

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