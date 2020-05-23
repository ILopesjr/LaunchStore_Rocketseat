const express = require('express')
const routes = express.Router()

const { OnlyUser, OnlyStakeholder } = require("../app/middlewares/session")

const OrdersController = require("../app/controllers/OrderController")


routes.get('/', OnlyUser, OrdersController.index)
routes.post('/', OnlyUser, OrdersController.buy)
routes.get('/sales', OnlyUser, OrdersController.sales)
routes.get('/:id', OnlyUser, OnlyStakeholder, OrdersController.show)
routes.post('/:id/:action', OnlyUser, OnlyStakeholder, OrdersController.update)

module.exports = routes
