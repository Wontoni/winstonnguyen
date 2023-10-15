const database = require('./databaseConnection');

async function addPatients() {
	let createUserSQL = `
        INSERT INTO comp4537.patient (
            name,
            date_of_birth
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





module.exports = {addPatients};