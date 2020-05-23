const db = require("../../config/db")
const Base = require("./Base")

Base.init({ table: 'orders' })

module.exports = {
  ...Base,
  async findOneOrder(orderID, partID){
    const results = await db.query(`SELECT * FROM orders WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)`, [orderID, partID])
    return results.rows[0]
  },
}