const express = require('express');
const uploadsController = require('../controllers/Uploads');
const router = express.Router();
const middlewares = require('../middlewares');

router.get('/', uploadsController.read);
router.get('/:id', uploadsController.readById);
router.post('/', middlewares.uploads, uploadsController.create);

module.exports = router;
