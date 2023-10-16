const database = require("./databaseConnection");

async function createTables() {
	let createUserSQL = `
		CREATE TABLE IF NOT EXISTS patient (
  		patientid INT NOT NULL AUTO_INCREMENT,
  		name VARCHAR(100) NOT NULL,
  		dateOfBirth DATETIME NOT NULL,
  		PRIMARY KEY (patientid));
	`;

	try {
		const results = await database.query(createUserSQL);

		console.log("Successfully created tables");
		console.log(results[0]);
		return true;
	} catch (err) {
		console.log("Error Creating tables");
		console.log(err);
		return false;
	}
}

async function printMySQLVersion() {
	let sqlQuery = `
        SHOW VARIABLES LIKE 'version';
    `;

	try {
		const results = await database.query(sqlQuery);
		console.log("Successfully connected to MySQL");
		console.log(results[0]);
		createTables();
		return true;
	} catch (err) {
		console.log("Error getting version from MySQL");
		console.log(err);
		return false;
	}
}

module.exports = { printMySQLVersion, createTables };