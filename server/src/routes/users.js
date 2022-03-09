const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/', UsersController.getUsersList);

router.get('/:id', UsersController.getUserById);

router.post('/register', UsersController.registerNewUser);

router.post('/signIn', UsersController.signIn);

router.put('/edit', UsersController.editUser);

module.exports = router;