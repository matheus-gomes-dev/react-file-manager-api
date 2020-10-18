const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const Uploads = require('../models/Uploads');
const UploadedData = require('../models/UploadedData');

const connection = new Sequelize(dbConfig);
Uploads.init(connection);
UploadedData.init(connection);

module.exports = connection;