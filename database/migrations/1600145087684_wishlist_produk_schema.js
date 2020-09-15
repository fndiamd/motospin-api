'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WishlistProdukSchema extends Schema {
  up() {
    this.create('wishlist_produks', (table) => {
      table.increments('id_wishlist')
      table.integer('id_produk')
        .unsigned()
        .references('id_produk')
        .inTable('produks')
        .onDelete('CASCADE')
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('wishlist_produks')
  }
}

module.exports = WishlistProdukSchema
