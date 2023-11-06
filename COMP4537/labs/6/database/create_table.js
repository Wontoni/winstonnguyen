
async function createTables() {
	let createTableSQL = `
    CREATE TABLE IF NOT EXISTS lab6_dictionary (
        word_id INT NOT NULL AUTO INCREMENT,
        word VARCHAR(45) NOT NULL,
        definition VARCHAR(100) NOT NULL,
        word_langauge VARCHAR(45) NOT NULL,
        definition_language VARCHAR(45) NOT NULL,
        PRIMARY KEY (word_id))
	  ADD UNIQUE INDEX word_UNIQUE (word ASC) VISIBLE;
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_0900_as_ci;
	`;

	let createLanguageTableSQL = `
	CREATE TABLE IF NOT EXISTS lab6_language (
		language_id INT NOT NULL AUTO_INCREMENT,
		code VARCHAR(45) NOT NULL,
		name VARCHAR(45) NOT NULL,
		PRIMARY KEY (language_id),
		UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE,
		UNIQUE INDEX code_UNIQUE (code ASC) VISIBLE)
	  ENGINE = InnoDB
	  DEFAULT CHARACTER SET = utf8mb4
	  COLLATE = utf8mb4_0900_as_ci;
	  `

	try {
		const results = await database.query(createTableSQL);

		const languageResults = await database.query(createLanguageTableSQL);

		console.log("Successfully created tables");
		console.log(results[0]);

		console.log(languageResults[0]);
		return true;
	} catch (err) {
		console.log("Error Creating tables");
		console.log(err);
		return false;
	}
}

module.exports = { createTables };