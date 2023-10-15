const mysql = require('mysql2/promise');

const dbConfig = {
	host: "localhost",
    port: 3306,
	user: "root",
	password: "Wontonious098123",
	database: "comp4537",
	multipleStatements: false,
	namedPlaceholders: true
};


var database = mysql.createPool(dbConfig);

module.exports = database;