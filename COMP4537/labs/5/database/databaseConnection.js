const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'sql.freedb.tech',
    port: 3306,
    user: 'freedb_insert_name',
    password: 'p!2#M#!jzTzJN&T',
    database: 'freedb__Database_'
};


var database = mysql.createPool(dbConfig);

module.exports = database;