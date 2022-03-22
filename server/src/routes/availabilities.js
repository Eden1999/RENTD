const express = require('express');
const router = express.Router();

const AvailabilitiesController = require('../controllers/availabilities.js');

router.get('/:workspaceId?date', AvailabilitiesController.getAllAvailabilitiesForWorkspace);
router.get('/user/:id', AvailabilitiesController.getAllRentedAvailabilitiesbyUserId);

module.exports = router;