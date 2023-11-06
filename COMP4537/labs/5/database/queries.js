const database = require('../../../../database/databaseConnection');

async function addDefinition(postData) {
	let createUserSQL = `
        INSERT INTO lab6_dictionary 
        (word, defintion, word_langauge, definition_language)
        VALUES
        (:word , :defintion, :word_langauge, :definition_language);
	`;
	
	try {
		await database.query(createUserSQL, postData);

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
        SELECT word, defintion, word_langauge, definition_language
        FROM lab6_dictionary
        WHERE word = :word
	`;
	
	try {
		await database.query(searchWordSql, postData);

		return true;
	}
	catch(err) {
		console.log("Error searching word");
        console.log(err);
		return false;
	}
}

async function labFiveQuery(query) {
    try {
        const result = await database.query(query);
        console.log(result);

        return {success: true, result: result};
    } 
    catch(err) {
        console.log("Error running lab five query");
        console.log(err);
        return {success: false, result:err};
    }
}



module.exports = {addDefinition, labFiveQuery};