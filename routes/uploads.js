const express = require('express');
const multer = require('multer');
const uploadsController = require('../controllers/Uploads');
const router = express.Router();
const uploadFiles = multer({ dest: 'tmp' });

router.post('/', uploadFiles.single('file'), uploadsController.create);

module.exports = router;
