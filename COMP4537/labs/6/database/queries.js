const database = require('../../../../database/databaseConnection');

async function addDefinition(postData) {
	let createDefinitionSQL = `
        INSERT INTO lab6_dictionary 
        (word, definition, word_langauge, definition_language)
        VALUES
        (:word , :definition, :word_language, :definition_language);
	`;
	
	try {
		await database.query(createDefinitionSQL, postData);

		return true;
	}
	catch(err) {
		console.log("Error adding definition");
        console.log(err);
		return false;
	}
}

async function searchWord(postData) {
	let searchWordSql = `
        SELECT word, definition, word_langauge, definition_language
        FROM lab6_dictionary
        WHERE word = :word
	`;
	
	try {
		const result = await database.query(searchWordSql, postData);
        //console.log(result);
		return result[0][0];
	}
	catch(err) {
		console.log("Error searching word");
        console.log(err);
		return false;
	}
}

module.exports = {addDefinition, searchWord};