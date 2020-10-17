const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const Uploads = require('../models/Uploads');

const connection = new Sequelize(dbConfig);
Uploads.init(connection);

module.exports = connection;