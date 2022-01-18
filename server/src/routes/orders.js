const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.get('/:workspaceId', OrdersController.getOrdersByWorkspaceId);

router.get('/:userId', OrdersController.getOrdersByUserId);

router.post('/create', OrdersController.createNewOrder);

module.exports = router;