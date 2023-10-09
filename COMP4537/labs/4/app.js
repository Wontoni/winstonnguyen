const http = require("http");
const url = require("url");
const GET = "GET";
const POST = "POST";

const endPointRoot = "/API/v1/";

let requestCount = 0;
let dictionary = [
	// { word: "word", definition: "DEFINTION" },
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

		if (req.method === GET && req.url === endPointRoot) {
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

		if (req.method === POST && req.url === endPointRoot) {
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
		}
	})
	.listen(8888);

console.log("Running on port 8888");
