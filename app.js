const express = require('express');

const app = express();
const uploadsRouter = require('./routes/uploads');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', uploadsRouter);

module.exports = app;
