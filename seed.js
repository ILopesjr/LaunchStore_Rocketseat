const { hash } = require("bcryptjs")
const faker = require("faker")

const User = require("./src/app/models/User")
const Product = require("./src/app/models/Product")
const File = require("./src/app/models/Files")

let usersIDs = [], productsIDs = []
const totalUsers = 5
const totalProducts = 15
const totalFiles = 50
const pass = '1234'

async function createUsers() {
  try {
    let users = []
    const password = await hash(`${pass}`, 8)

    while (users.length < totalUsers) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        cpf_cnpj: faker.random.number(99999999999),
        cep: faker.random.number(99999999),
        address: faker.address.streetName()
      })
    }

    const usersPromise = users.map(user => User.saveCreate(user))

    usersIDs = await Promise.all(usersPromise)

  } catch (err) {
    console.error(err + " createUsers seed.js");
  }
}

async function createProducts() {
  try {
    let products = [], files = []

    while (products.length < totalProducts) {

      products.push({
        category_id: Math.ceil(Math.random() * 3),
        user_id: usersIDs[Math.floor(Math.random() * totalUsers)],
        name: faker.name.title(),
        description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        old_price: faker.random.number(99999),
        price: faker.random.number(9999),
        quantity: faker.random.number(99),
        status: Math.round(Math.random())
      })
    }

    const productsPromise = products.map( product => Product.saveCreate(product)) 
    productsIDs = await Promise.all(productsPromise)

    while (files.length < totalFiles) {
      files.push({
        name: faker.image.image(),
        path: `public/images/placeholder.png`,
        product_id: productsIDs[Math.floor(Math.random() * totalProducts)]
      })
    }

    // check se todos os produtos tem no mínimo 1 e no máximo 6 files
    for(let i = 1; i < products.length; i++ ){
      let total = 0
      const limit = 5
      
      files.forEach(file => {
        if(file.product_id == i) total++
        if(total > limit){
          files.splice(files.indexOf(file), 1)
        }
      })

      if( total == 0 ){
        files.push({
          name: faker.image.image(),
          path: `public/images/placeholder.png`,
          product_id: i
        })
      } 
    }

    const filesPromise = files.map(file => File.saveCreate(file))
    await Promise.all(filesPromise)
    
  } catch (err) {
    console.error(err + " createProducts seed.js");
  }
}

async function init() {
  await createUsers()
  await createProducts()
}

init()