const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/', UsersController.getUsersList);

router.get('/:id', UsersController.getUserById);

router.post('/register', UsersController.registerNewUser);

router.post('/signIn', UsersController.signIn);

router.post('/addWorkspaceToFavorites', UsersController.addWorkspaceToFavorites);

router.post('/removeFavoriteWorkspace', UsersController.RemoveWorkspaceFromFavorites);

router.put('/', UsersController.editUser);

router.post('/reset-password', UsersController.resetPassword);

router.post('/validate-token', UsersController.validateToken);

router.post('/update-password', UsersController.updatePassword);

router.post('/change-password', UsersController.changePassword);

router.post('/update-username', UsersController.updateUsername);

router.post('/upload-profile-image', UsersController.uploadProfilePhoto);

module.exports = router;