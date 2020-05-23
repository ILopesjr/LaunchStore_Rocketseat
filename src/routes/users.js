const express = require('express')
const routes = express.Router()

const SessionController = require("../app/controllers/SessionController")
const UserController = require("../app/controllers/UserController")

const { checkFields, checkPasswordMatch, checkUserID} = require("../app/validators/user")
const { checkEmail, checkLogin, checkResetPassword } = require("../app/validators/session")
const { UserLogged, OnlyUser } = require("../app/middlewares/session")

// LOGIN AND LOGOUT
routes.get('/login', UserLogged, SessionController.loginForm)
routes.post('/login', checkLogin,SessionController.login)
routes.post('/logout', SessionController.logout)

// PASSWORD
routes.get('/forgot-password', SessionController.forgotForm) //solicitar reset
routes.post('/forgot-password', checkEmail, SessionController.forgot) //form para inserir token enviado por e-mail para reset de senha 
routes.get('/password-reset', SessionController.resetForm) // enviar solicitação (irá validar e se estiver correto enviará e-mail com token)
routes.post('/password-reset', checkResetPassword, SessionController.reset) //validação do token e reset de senha

// USERS
routes.get('/register', UserController.create)
routes.post('/register', checkFields ,UserController.save)

routes.get('/', OnlyUser, checkUserID, UserController.show)
routes.get('/', UserController.edit) //poderia ser o mesmo controler do create, já que a view fields.njk foi preparada para ambas situações
routes.put('/', checkPasswordMatch, UserController.update)
routes.delete('/', UserController.delete)

routes.get('/ads', UserController.ads)

module.exports = routes