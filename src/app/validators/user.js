const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body){
  const keys = Object.keys(body)
  for(let key of keys){
    if(body[key]==""){
      return {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      }
    }
  }

}

async function checkFields(req, res, next){
  let { email, cpf_cnpj, password, passwordCheck } = req.body
  
  // check if has all fields
  const fillAllfields = checkAllFields(req.body)
  if(fillAllfields)
    return res.render('user/register', fillAllfields)
  
  // check if user exists [email, cpf_cnpj]
  cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
  const user = await User.findOne({
    WHERE: {email},
    OR: {cpf_cnpj}
  })

  if(user) return res.render('user/register.njk',{
        user: req.body,
        error: 'Usuário já cadastrado!'
  })

  // check if password and passwordCheck match
  if(password!=passwordCheck) return res.render('user/register.njk',{
        user: req.body,
        error: 'Senhas diferentes!'
  })

  next()
}

async function checkUserID(req, res, next){
  const { userID: id } = req.session

  const user = await User.findOne({WHERE: {id}}) //filtro do DB
  
  if(!user) return res.render('user/register',{
    error: 'Usuário não encontrado!'
  })

  req.user = user

  next()
}

async function checkPasswordMatch(req, res, next){
  const { id, password } = req.body

  const fillAllfields = checkAllFields(req.body)

  if(fillAllfields)
    return res.render('user/index.njk', fillAllfields)

  const user = await User.findOne({WHERE: {id}})

  const passed = await compare(password, user.password)

  if(!passed)
    return res.render("user/index", {
      user: req.body,
      error: "Senha incorreta!"
    })
  
  req.user = user

  next()
}

module.exports = {
  checkFields,
  checkUserID,
  checkPasswordMatch
}