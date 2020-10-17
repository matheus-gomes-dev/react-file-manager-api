const express = require('express');
const uploadsController = require('../controllers/Uploads');
const router = express.Router();


router.post('/', uploadsController.create);

module.exports = router;
