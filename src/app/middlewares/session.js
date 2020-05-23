const Product = require('../models/Product')
const Order = require('../models/Order')

function OnlyUser(req, res, next){
  if(!req.session.userID)
    return res.redirect('/users/login')
  
  next()
}

function UserLogged(req, res, next){
  if(req.session.userID)
   return res.redirect('/users')

   next()
}

async function OnlyOwner(req, res, next){
  try {
    const product = await Product.findOne({ WHERE: { user_id: req.session.userID }, AND: { id: req.params.id }})
    if(!product) 
      return res.redirect('/users/ads')
  
    next()

  } catch (err) {
    console.log(err + " OnlyOwner seeeion.js")
    console.log(product)

    return res.redirect('/users/ads')  
  }

}

async function OnlyStakeholder(req, res, next){
  const order = await Order.findOneOrder(req.params.id, req.session.userID)
  if(!order) 
    return res.redirect('/users') //colocar pagina não encontrada 404

  next()
}

module.exports = {
  OnlyUser,
  UserLogged,
  OnlyOwner,
  OnlyStakeholder
}