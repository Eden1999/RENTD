const express = require("express");
const router = express.Router();

const WorkspacesController = require("../controllers/workspaces");

router.get("/userFavoriteWorkspaces", WorkspacesController.getUserFavoriteWorkspaces);

router.get("/hosts/:hostId", WorkspacesController.getWorkspacesByHostId);

router.post("/create", WorkspacesController.createNewWorkspace);

router.post("/search", WorkspacesController.searchWorkspaces);

router.get("/recommendations/:userId", WorkspacesController.getUserRecommendations);

router.post("/create", WorkspacesController.createNewWorkspace);
router.put("/edit/:workspaceId", WorkspacesController.editWorkspace);

router.delete("/:id", WorkspacesController.deleteWorkspace);

router.get("/:workspaceId/photos/:photoId", WorkspacesController.getWorkspacePhotos);


module.exports = router;
