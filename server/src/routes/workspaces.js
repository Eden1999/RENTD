const express = require('express');
const router = express.Router();

const WorkspacesController = require('../controllers/workspaces');

router.get('/', WorkspacesController.getWorkspacesList);

router.get('/userFavoriteWorkspaces', WorkspacesController.getUserFavoriteWorkspaces);

router.get('/:userId', WorkspacesController.getWorkspacesByUserId);

router.get('/hosts/:hostId', WorkspacesController.getWorkspacesByHostId);

router.get('/recommendations/:userId', WorkspacesController.getUserRecommendations);

router.post('/create', WorkspacesController.createNewWorkspace);

router.post('/search', WorkspacesController.searchWorkspaces)

router.put('/edit/:workspaceId', WorkspacesController.editWorkspace);

router.delete('/:id', WorkspacesController.deleteWorkspace)


module.exports = router;