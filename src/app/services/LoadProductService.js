const Product = require("../models/Product")

const { formatPrice, date } = require('../lib/utils')


async function getImages(ProductID){
  let files = await Product.files(ProductID)
  files = files.map( file => ({
    id: file.id,
    name: file.name,
    path: file.path,
    src: `${file.path.replace("public","")}`
  }))

  return files
}

async function format(product){
  const files = await getImages(product.id)
  product.img = files[0].src
  product.files = files
  product.formattedOldPrice = formatPrice(product.old_price)
  product.formattedPrice = formatPrice(product.price)

  const { day, hour, minutes, monthExt } = date(product.updated_at)
  
  product.published = {
    day: `${day} de ${monthExt}`,
    hour: `${hour}h${minutes}`
  }

  return product
}

const LoadService = {
  load(service, filter){
    this.filter = filter
    return this[service]()
  },
  async product(){
    try {
      const product = await Product.findOne(this.filter)
      return format(product)
    } catch (err) {
      console.error(err + " product LoadProductService");
    }
  },
  async products(){
    try {
      let products = await Product.all(this.filter) //.findAll() - usado por Mayk
      const productsPromise = products.map(format) // products.map( product => format(product) )  - É a mesma coisa            
      
      return Promise.all(productsPromise)
    } catch (err) {
      console.error(err + " products LoadProductService");
      
    }
  },
  async productsUser(){
    try {
      const products = await Product.findAll(this.filter) 
      const productsPromise = products.map(format) 
      
      return Promise.all(productsPromise)
    } catch (err) {
      console.error(err + " productUser LoadProductService");
    }
  },
  async productWithDeleted(){
    try {
      let product = await Product.findOneWithDeleted(this.filter)
      return format(product)

    } catch (err) {
      console.error(err + " productWithDeleted LoadProductService");
    }
  },
  format,

}

module.exports = LoadService