require("dotenv").config();
const express = require('express');
const port = process.env.PORT || 8080;
const GET = "GET";
const POST = "POST";

const utils = require('./COMP4537/labs/3/modules/utils')

// Database Connection
const database = require('./database/databaseConnection');
const db_utils = require('./database/db_utils');

// Lab 5 queries
const db_lab_five_queries = require('./COMP4537/labs/5/database/queries.js');

// Lab 6 queries
const db_lab_six_queries = require('./COMP4537/labs/6/database/queries.js');

db_utils.printMySQLVersion();

// Strings
const labFourApiRoute = "/COMP4537/labs/4/API/v1/";
const labFiveApiRoute = "/COMP4537/labs/5/API/v1/sql/";
const labSixApiRoute = "/COMP4537/labs/6/API/v1/";
const labSixSearchError = 'Error in search query';

let requestCount = 0;
let dictionary = [
];

const app = express();

app.use(express.json());


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.get('/', (req,res) => { 
    res.sendFile(__dirname + "/index.html")
}); 

app.get('/COMP4537/labs/3/getDate/:name', (req, res) => {
    const text = utils.getDate(req.params.name);
    res.send(`<div style="color: blue">${text}</div>`);
  });
  
  app.get('/COMP4537/labs/4/search', (req, res) => {
    res.sendFile(__dirname + '/COMP4537/Labs/4/search.html');
  });
  
  app.get('/COMP4537/labs/4/store', (req, res) => {
    res.sendFile(__dirname + '/COMP4537/Labs/4/store.html');
  });
  
  app.get('/COMP4537/labs/4/index', (req, res) => {
    res.sendFile(__dirname + '/COMP4537/Labs/4/index.html');
  });
  
  app.get(labFourApiRoute, (req, res) => {
    for (let i = 0; i < dictionary.length; i++) {
      console.log('Word: ' + dictionary[i].word + ' Definition: ' + dictionary[i].definition);
    }
  
    let result = searchDefinition(req.params.word);
    if (result) {
      res.send('Request #' + requestCount + '<br><br>' + result);
    } else {
      res.send('Request #' + requestCount + "<br><br>The word '" + req.params.word + "' is not found!");
    }
  });
  
  app.post(labFourApiRoute, (req, res) => {
    let hasWrongInput = inputCheck(req.body.word);
    if (hasWrongInput) {
      res.send('Request #' + requestCount + "<br><br>Unsuccessful: The entered word is either blank, empty, or has numbers in it!");
      return;
    }
  
    let result = addDefinition(req.body.word, req.body.definition);
    if (result) {
      res.send('Request #' + requestCount + ': (Total entries in your dictionary: ' + dictionary.length + ')<br><br>New entry recorded:<br><br>"' + req.body.word + ': ' + req.body.definition + '"');
    } else {
      res.send('Request #' + requestCount + "<br><br>Unsuccessful: The new word already exists in the dictionary!");
    }
  });
  
  app.get('/COMP4537/labs/5/index', (req, res) => {
    res.sendFile(__dirname + '/COMP4537/labs/5/index.html');
  });
  
  app.post(labFiveApiRoute + 'addRows/', (req, res) => {
    console.log('ADD ROWS');
    const success = db_lab_five_queries.addPatients();
  
    if (success) {
      console.log('Successfully added patients');
      res.send('Successfully added patients');
    } else {
      console.log(success);
      res.send(success);
      res.send('Error adding patients');
    }
  });
  
  app.get(labFiveApiRoute, async (req, res) => {
    let query = '' + req.params.query;
    console.log('server-side query received is: ' + query);
  
    let result = await db_lab_five_queries.labFiveQuery(query);
    if (result) {
      console.log(result);
      res.json(result);
    } else {
      res.send('Error in running select query');
    }
  });
  
  app.post(labFiveApiRoute, async (req, res) => {
    let result = await db_lab_five_queries.labFiveQuery(req.body.query);
    if (result.success) {
      console.log(result);
      res.send('Successfully inserted values into the database');
    } else {
      res.send(result.result.sqlMessage);
    }
  });

  app.get(labSixApiRoute + "definition/:word", async (req, res) => {
    let result = await db_lab_six_queries.searchWord({word: req.params.word})
    if (result) {
        res.json(result);
      } else {
        const returnJson = {
            error: "Entry Not Found",
            message: `The word ${req.params.word} does not exist in the dictionary`,
            entry: {
                word: req.params.searchWord
            },
            total: 0 // TODO
        }
        // res.status(404);
        res.send(returnJson);
      }
  })

  app.post(labSixApiRoute + "definition/", async (req, res) => {
    const definitionInsertJson = {
        word: req.body.word,
        definition: req.body.definition,
        word_language: req.body.word_language,
        definition_language: req.body.def_language
    }

    let result = await db_lab_six_queries.addDefinition(definitionInsertJson);
    if (result) {
        const returnJson =  {
            "message": "Entry created successfully",
            "entry": definitionInsertJson,
            "total": 0 // TODO
          }
      res.send(returnJson);
    } else {
        const returnJson =  {
            "error": "Word Conflict",
            "message": `The word ${req.body.word} already exists.`,
            "entry": definitionInsertJson,
            "total": 0 // TODO
          }
      res.send(returnJson);
    }
  });
  
  app.get("*", (req, res) => {
    console.log('URL: ' + req.url);
    console.log('METHOD: ' + req.method);
    res.send('PAGE NOT FOUND');
  });
  
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });



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

 /* 
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
        const success = db_lab_five_queries.addPatients();

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

        let result = await db_lab_five_queries.labFiveQuery(query);
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

            let result = await db_lab_five_queries.labFiveQuery(q.query.query);
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
*/