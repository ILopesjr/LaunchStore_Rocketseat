const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { OnlyUser, OnlyOwner } = require('../app/middlewares/session')
const { FillAllFields, FillAllFieldsUpdate } = require('../app/validators/product')

const ProductController = require("../app/controllers/ProductController")
const SearchController = require("../app/controllers/SearchController")

// SEARCH
routes.get('/search', SearchController.index)

// PRODUCTS
routes.get('/create', OnlyUser, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', OnlyUser, OnlyOwner, ProductController.edit)

// O middleware multer vai verificar o input de name = photo dos forms e irá salvar os arquivos no backend conforme os parametros configurados e além da req.body a rota apresentará tb o req.files
routes.post('/', OnlyUser, multer.array('photos', 6), FillAllFields, ProductController.save)
routes.put('/', OnlyUser, multer.array('photos', 6), FillAllFieldsUpdate, ProductController.update)

routes.delete('/', OnlyUser, ProductController.delete)

module.exports = routes
