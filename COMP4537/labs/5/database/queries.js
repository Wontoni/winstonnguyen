const database = require('./databaseConnection');

async function addPatients() {
	let createUserSQL = `
        INSERT INTO patient (
            name,
            dateOfBirth
        )
        VALUES
            (
                'Sara Brown',
                '1999-01-01'
            ),
            (
                'John Smith',
                '1941-01-01'
            ),
            (
                'Jack Ma',
                '1961-01-30'
            ),
            (
                'Elon Musk',
                '1999-01-01'
            );
	`;
	
	try {
		await database.query(createUserSQL);

		return true;
	}
	catch(err) {
		console.log("Error adding patients");
        console.log(err);
		return false;
	}
}

async function labFiveQuery(query) {
    try {
        const result = await database.query(query);

        return {success: true, result: result};
    } 
    catch(err) {
        console.log("Error running lab five query");
        console.log(err);
        return {success: false, result:err};
    }
}



module.exports = {addPatients, labFiveQuery};