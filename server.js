require("dotenv").config();
const express = require('express');
const port = process.env.PORT || 8080;
const GET = "GET";
const POST = "POST";

const utils = require('./COMP4537/labs/3/modules/utils')

// Database Connection
const database = require('./database/databaseConnection');
const db_utils = require('./database/db_utils');

// Lab 4 Strings
const labFourApiRoute = "/COMP4537/labs/4/API/v1/";

// Lab 5 queries + Strings
const db_lab_five_queries = require('./COMP4537/labs/5/database/queries.js');
const labFiveApiRoute = "/COMP4537/labs/5/API/v1/sql/";

// Lab 6 queries + Strings
const db_lab_six_queries = require('./COMP4537/labs/6/database/queries.js');
const dbLabSixStrings = require('./COMP4537/labs/6/strings_lab_six.js');

let labSixRequestCount = 0;

db_utils.printMySQLVersion();


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

  app.get(dbLabSixStrings.labSixApiRoute + "definition/:word", async (req, res) => {
    let result = await db_lab_six_queries.searchWord({word: req.params.word})
    if (result) {
        res.status(200).json(result);
      } else {
        const returnJson = {
            error: dbLabSixStrings.dbLabSixMissingEntry,
            message: `The word ${req.params.word} does not exist in the dictionary`,
            entry: {
                word: req.params.word
            }
        }
        res.status(404).send(returnJson);
      }
  })

  app.post(dbLabSixStrings.labSixApiRoute + "definition/", async (req, res) => {
    labSixRequestCount++;

    let missingParams = [];
    if (!req.body.word) {
        missingParams.push("word");
    }
    if(!req.body.definition) {
        missingParams.push("definition");
    }
    if(!req.body.word_language) {
        missingParams.push("word_language");
    }
    if(!req.body.def_language) {
        missingParams.push("definition_language");
    }

    const definitionInsertJson = {
        word: req.body.word,
        definition: req.body.definition,
        word_language: req.body.word_language,
        definition_language: req.body.def_language
    }

    if(missingParams != false) {
        res.status(400);
        const returnJSON = {
            message: dbLabSixStrings.dbLabSixMissingInput + missingParams,
            entry: definitionInsertJson
          }
        res.send(returnJSON);
    } 
    else {
        let result = await db_lab_six_queries.addDefinition(definitionInsertJson);
        if (result) {
            const returnJson =  {
                message: dbLabSixStrings.dbLabSixEntrySuccess,
                entry: definitionInsertJson,
                total: labSixRequestCount
            }
        res.status(201).send(returnJson);
        } else {
            const returnJson =  {
                error: dbLabSixStrings.dbLabSixConflictError,
                message: `The word ${req.body.word} already exists. ` + dbLabSixStrings.dbLabSixEntryError,
                entry: definitionInsertJson,
                total: labSixRequestCount
            }
        res.status(409).send(returnJson);
        }
    }
  });

  app.delete(dbLabSixStrings.labSixApiRoute + "definition/", async(req, res) => {
    labSixRequestCount++;

    if (!req.body.word) {
        res.status(400);
        const returnJSON = {
            message: dbLabSixStrings.dbLabSixMissingInput + "word",
            entry: {word: ""}
        }
        res.send(returnJSON);
    }
    else {
        let result = await db_lab_six_queries.deleteWord({word: req.body.word});
        if (result) {
            const returnJson =  {
                message: dbLabSixStrings.dbLabSixDeleteSuccess,
                entry: {
                    word: req.body.word
                },
                total: labSixRequestCount
              }
          res.send(returnJson);
        } else {
            const returnJson =  {
                error: dbLabSixStrings.dbLabSixMissingEntry,
                message: `The word ${req.body.word} does not exist in the dictionary.`,
                entry: {
                    word: req.body.word
                },
                total: labSixRequestCount
              }
          res.status(404).send(returnJson);
        }
    }
  });

  app.patch(dbLabSixStrings.labSixApiRoute + "definition/", async (req, res) => {
    labSixRequestCount++;
    let missingParams = [];
    if (!req.body.word) {
        missingParams.push("word");
    }
    if(!req.body.definition) {
        missingParams.push("definition");
    }
    if(!req.body.word_language) {
        missingParams.push("word_language");
    }
    if(!req.body.def_language) {
        missingParams.push("definition_language");
    }

    const definitionInsertJson = {
        word: req.body.word,
        definition: req.body.definition,
        word_language: req.body.word_language,
        definition_language: req.body.def_language
    }

    if(missingParams != false) {
        res.status(400);
        const returnJSON = {
            message: dbLabSixStrings.dbLabSixMissingInput + missingParams,
            entry: definitionInsertJson
          }
        res.send(returnJSON);
    }
    else {
        let result = await db_lab_six_queries.updateWord(definitionInsertJson);
        if (result) {
            const returnJson =  {
                message: dbLabSixStrings.dbLabSixUpdateSuccess,
                entry: definitionInsertJson,
                total: labSixRequestCount
              }
          res.send(returnJson);
        } else {
            const returnJson =  {
                error: dbLabSixStrings.dbLabSixMissingEntry,
                message: `The word ${req.body.word} does not exist in the dictionary.`,
                entry: definitionInsertJson,
                total: labSixRequestCount
              }
          res.send(returnJson);
        }
    }
  });

  app.get(dbLabSixStrings.labSixApiRoute + "languages/", async (req, res) => {
    const results = await db_lab_six_queries.getLanguages();
    if(results) {
        res.send(results);
    } else {
        res.send({success: false});
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
