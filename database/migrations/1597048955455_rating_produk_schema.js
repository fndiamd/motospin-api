'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RatingProdukSchema extends Schema {
  up () {
    this.create('rating_produks', (table) => {
      table.increments('id_rating_produk')
      table.integer('rating')
      table.string('rating_komentar')
      table.integer('id_produk').unsigned().references('id_produk').inTable('produks').onDelete('CASCADE')
      table.integer('id_user').unsigned().references('id_user').inTable('users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('rating_produks')
  }
}

module.exports = RatingProdukSchema
