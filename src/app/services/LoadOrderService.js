const Order = require("../models/Order")
const User = require("../models/User")
const LoadProductService = require("./LoadProductService")

const { formatPrice, date } = require('../lib/utils')

async function format(order){
  // detalhes do produto
  order.product = await LoadProductService.load('productWithDeleted', { WHERE: { id: order.product_id } })

  // detalhes do comprador
  order.buyer = await User.findOne({ WHERE: {id: order.buyer_id} })

  // detalhes do vendedor
  order.seller = await User.findOne({ WHERE: {id: order.seller_id} })

  // formatação de preço 
  order.formattedPrice = formatPrice(order.price)
  order.formattedTotal = formatPrice(order.total)

  // formatação de status
  const statuses = {
    open: 'Aberto',
    sold: 'Vendido',
    canceled: 'Cancelado'
  }

  order.formattedStatus = statuses[order.status]

  // atualizado em ...
  const updatedAt = date(order.updated_at)
  order.formattedUpdatedAt = `Atualizado em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} às ${updatedAt.hour}h${updatedAt.minutes}`

  return order
}

const LoadService = {
  load(service, filter){
    this.filter = filter
    return this[service]()
  },
  async order(){
    try {
      const order = await Order.findOne(this.filter)
      return format(order)
    } catch (err) {
      console.error(err + " order LoadOrderService");
      
    }
  },
  async orders(){
    try {
      const orders = await Order.findAll(this.filter) 
      const ordersPromise = orders.map(format) 
      
      return Promise.all(ordersPromise)
    } catch (err) {
      console.error(err + " orders LoadOrderService");
      
    }
  },
  format,

}

module.exports = LoadService