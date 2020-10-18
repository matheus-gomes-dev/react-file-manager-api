const express = require('express');
const cors = require('cors');
require('./database');

const app = express();
const uploadsRouter = require('./routes/uploads');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/uploads', uploadsRouter);

module.exports = app;
