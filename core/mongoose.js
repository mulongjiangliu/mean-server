const config = require('../config')
const mongoose = require('mongoose');

const database_uri = `mongodb://${config.dbhost}:${config.dbport}/${config.dbname}`

const db = mongoose.createConnection(database_uri);

db.on('error', console.error.bind(console, '---conntect error---'));

db.once('open', () =>{
    console.info(`---open ${config.dbname}---`);
})

module.exports = db;
