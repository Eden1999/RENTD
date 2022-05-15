const express = require('express');
const router = express.Router();

const AssetTypesController = require('../controllers/assetTypes.js');

router.get('/', AssetTypesController.getAssetTypesList);

module.exports = router;