const db = require("../../config/db")
const Base = require("./Base")

Base.init({ table: 'products' })

module.exports = {
  ...Base,
  async all(){
    const results = await db.query(
      `SELECT * FROM products
      WHERE status = '1'
      AND quantity > '0'
      ORDER BY updated_at DESC
      `)

      return results.rows
  },
  async files(id){
    const results = await db.query(`SELECT * FROM files WHERE product_id = $1 `, [id])

    return results.rows
  },
  async search(params){
    const { filter, category } = params
    let query ="", filterQuery = ""
    
    if (filter) {
      filterQuery += `
        WHERE
        (products.name ilike '%${filter}%' 
        OR products.description ilike '%${filter}%') 
      `
    } else {
      filterQuery += `
        WHERE 1=1
      `
    }

    if(category){
      filterQuery += `
        AND products.category_id = ${category} 
        `
    }
  
    filterQuery += `
      AND status != 0
      AND quantity > 0
    `

    query = `
      SELECT products.*,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON (categories.id = products.category_id)
      ${filterQuery}
    `
    const results = await db.query(query)

    return results.rows
  
  }
}

