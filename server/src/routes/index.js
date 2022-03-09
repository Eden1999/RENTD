const express = require('express');
const router = express.Router();

const usersRouter = require('./users')
const workspacesRouter = require('./workspaces')
const ratingsRouter = require('./ratings')
const ordersRouter = require('./orders')
const spacetypesRouter = require('./spacetypes')

router.use('/users', usersRouter)
router.use('/workspaces', workspacesRouter)
router.use('/ratings', ratingsRouter)
router.use('/orders', ordersRouter)
router.use('/spacetypes', spacetypesRouter)

router.get('/health', (req, res) => {
    res.status(200).send('Ok');
});

module.exports = router