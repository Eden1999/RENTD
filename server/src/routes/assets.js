const express = require('express');
const router = express.Router();

const AssetsController = require('../controllers/assets');

router.get('/:id', AssetsController.getAssetById);

router.get('/workspaceId/:id', AssetsController.getAssetsByWorkspaceId);

module.exports = router;