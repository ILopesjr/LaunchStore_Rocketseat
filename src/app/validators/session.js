const User = require('../models/User')
const { compare } = require('bcryptjs')

async function checkLogin(req, res, next){

  try {
    const { email, password } = req.body

    const user = await User.findOne({WHERE:{email}})

    if(!user) return res.render('session/login.njk',{
      user: req.body,
      error: 'Usuário não encontrado!'
    })

    const passed = await compare(password, user.password)

    if(!passed)
      return res.render("session/login.njk", {
        user: req.body,
        error: "Senha incorreta!"
      })
  
    req.user = user

    next()
    
  } catch (err) {
    console.error(err + " checkLogin session.js")
  }

}

async function checkEmail(req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({WHERE:{email}})
    if(!user) return res.render(`session/forgot-password.njk`,{
      user: req.body,
      error: 'E-mail não encontrado cadastrado!'
  })

  req.user = user

  next()
  } catch (err) {
    console.error(err + " checkEmail session.js")
  }
  
}

async function checkResetPassword(req, res, next){
  try {
    const { email, password, passwordCheck, token } = req.body
    
    // producurar usuário
    let user = await User.findOne({ WHERE: { email } })

    if (!user) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'E-mail não cadastrado!'
    })

    // verificar senha match
    if(password!=passwordCheck) return res.render('session/password-reset.njk',{
      user: req.body,
      token,
      error: 'Senhas diferentes!'
    })

    // verificar token match
    if(token != user.reset_token) return res.render("session/forgot-password.njk", {
      user: req.body,
      error:"Token inválido! Solite uma nova recuperação de senha."
    })

    // verificar token expired
    let now = new Date
    now = now.setMinutes(now.getMinutes())
 
    if(now > user.reset_token_expires) return res.render("session/forgot-password.njk", {
      user: req.body,
      error:"Token Expirado! Solite uma nova recupeção de senha."
    })

    req.user = user

    next()

  } catch (err) {
    console.error(err + " checkResetPassword session.js")
  }
  
}

module.exports = {
  checkLogin,
  checkEmail,
  checkResetPassword
  
}