const express = require('express');
const router = express.Router();

const WorkspacesController = require('../controllers/workspaces');

router.get('/', WorkspacesController.getWorkspacesList);

router.get('/:userId', WorkspacesController.getWorkspacesByUserId);

router.post('/create', WorkspacesController.createNewWorkspace);

router.post('/search', WorkspacesController.searchWorkspaces)

router.put('/edit/:workspaceId', WorkspacesController.createNewWorkspace);


module.exports = router;