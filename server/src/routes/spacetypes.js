const express = require('express');
const router = express.Router();

const SpacetypesController = require('../controllers/spacetypes');

router.get('/', SpacetypesController.getSpacetypesList);

module.exports = router;