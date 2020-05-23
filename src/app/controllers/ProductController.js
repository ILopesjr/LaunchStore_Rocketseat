const Category = require('../models/Category')
const Product = require('../models/Product')
const Files = require('../models/Files')
const LoadProductService = require("../services/LoadProductService")

const { unlinkSync } = require('fs')

module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.findAll()
      return res.render('products/create.njk', { categories })
    } catch (err) {
      console.error(err + " create ProductController")
    }
  },
  async save(req, res) {
    try {

      let { category_id, name, description, price, old_price, quantity, status } = req.body

      price = price.replace(/\D/g, "")

      const product_id = await Product.saveCreate({
        category_id,
        name,
        description,
        price,
        old_price: old_price || price,
        quantity,
        status: status || 1,
        user_id: req.session.userID
      })

      const filesPromise = req.files.map(file => Files.saveCreate({ name: file.filename, path: file.path.replace(/\\/g, "/") , product_id }))
      await Promise.all(filesPromise)

      return res.redirect(`products/${product_id}`) 

    } catch (err) {
      console.error(err + " save ProductController");
    }
  },
  async show(req, res) {
    try {
      const product = await LoadProductService.load('product', {
        WHERE: { id: req.params.id } 
      }) 

      return res.render('products/show', { product, files: product.files }) 

    } catch (err) {
      console.error(err + " show ProductController");
    }
  },
  async edit(req, res) {
    try {
      const product = await LoadProductService.load('product', {
        WHERE: { id: req.params.id } 
      }) 
      const categories = await Category.findAll() //retorna um array de rows com todas as categories do DB

      return res.render('products/edit', { product, categories })

    } catch (err) {
      console.error(err + " edit ProductController");
    }
  },
  async update(req, res) {
    try {
      let { id, category_id, name, description, price, old_price, quantity, status } = req.body

  
      if (req.files.length != 0) {
        const filesPromise = req.files.map(file => 
          Files.saveCreate({ name: file.filename, path: file.path, product_id: id }))
        await Promise.all(filesPromise)
      }
  

      if (req.body.removed_files) {
        let removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map(async id => {
          const file = await Files.find(id)
          unlinkSync(file.path)
          Files.delete(id)
        })

        await Promise.all(removedFilesPromise)
      }
  
      price = price.replace(/\D/g, "")
  
      let lastPrice = await Product.find(id)
      lastPrice = lastPrice.price
  
      if (lastPrice != price) {
        old_price = lastPrice
      }
  
      price = price.replace(/\D/g, "")
  
      await Product.saveUpdate(id, {
        category_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      })
  
      return res.redirect(`products/${id}`)
    } catch (err) {
      console.error(err + " update ProductController");
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body

      const files = await Product.files(id)
      
      await Product.delete(id)

      files.map( async file => {
        try {
          unlinkSync(file.path)
        } catch (err) {
          console.error(err);
          
        }
      })

      return res.redirect('/products/create')

    } catch (err) {
      console.error(err + " delete ProductController");
    }
  }

}

