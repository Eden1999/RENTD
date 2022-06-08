const express = require('express');
const router = express.Router();

const RatingsController = require('../controllers/ratings');

router.get('/:workspaceId', RatingsController.getRatingsByWorkspaceId);

router.post('/create', RatingsController.createNewRating);

module.exports = router;