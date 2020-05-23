const { formatPrice } = require("./utils")

const Cart = {
  init(oldCart){
    if(oldCart){
      this.items = oldCart.items
      this.total = oldCart.total
    } else {
      this.items = []
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }

    return this
  },
  addOne(addProduct){
    let inCart = this.getCartItem(addProduct.id)

    if(!inCart){
      inCart = {
        product:{
          ...addProduct,
          formattedPrice: formatPrice(addProduct.price)
        },
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }

      this.items.push(inCart)
    }
    
    if(inCart.quantity >=  addProduct.quantity) 
      return this
    
    inCart.quantity++
    inCart.price += inCart.product.price //inCart.price = incart.product.price * incart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)
    
    this.total.quantity++
    this.total.price += inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    return this

  },
  removeOne(productID){
    const inCart = this.getCartItem(productID)

    if(!inCart) return this

    inCart.quantity--
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    this.total.quantity--
    this.total.price -= inCart.product.price 
    this.total.formattedPrice = formatPrice(this.total.price)

    if(inCart.quantity == 0){
      this.items = this.items.filter(item => item.product.id != inCart.product.id)
      return this
    }

    return this
  },
  delete(productID){
    const inCart = this.getCartItem(productID) 

    if(!inCart) return this

    if(this.items.length > 0) {
      this.total.quantity -= inCart.quantity
      this.total.price -= (inCart.quantity * inCart.product.price)
      this.total.formattedPrice = formatPrice(this.total.price)
    }

    this.items = this.items.filter( item => item.product.id != inCart.product.id)

    return this
  },
  getCartItem(productID){
    return this.items.find(item => item.product.id == productID)
  }
}

module.exports = Cart