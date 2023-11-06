
async function createTables() {
	let createTableSQL = `
    CREATE TABLE IF NOT EXISTS lab6_dictionary (
        word_id INT NOT NULL,
        word VARCHAR(45) NOT NULL,
        definition VARCHAR(100) NOT NULL,
        word_langauge VARCHAR(45) NOT NULL,
        definition_language VARCHAR(45) NOT NULL,
        PRIMARY KEY (word_id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_0900_as_ci;
	`;

	try {
		const results = await database.query(createTableSQL);

		console.log("Successfully created tables");
		console.log(results[0]);
		return true;
	} catch (err) {
		console.log("Error Creating tables");
		console.log(err);
		return false;
	}
}

module.exports = { createTables };