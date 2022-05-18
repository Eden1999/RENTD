const express = require('express');
const router = express.Router();

const AssetsController = require('../controllers/assets');

router.get('/:id', AssetsController.getAssetById);

module.exports = router;