const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const Uploads = require('../models/Uploads');
const UploadedData = require('../models/UploadedData');

const connection = new Sequelize(dbConfig);
Uploads.init(connection);
UploadedData.init(connection);

Uploads.associate(connection.models);
UploadedData.associate(connection.models);

module.exports = connection;