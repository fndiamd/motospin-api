'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BengkelFavoriteSchema extends Schema {
  up() {
    this.create('bengkel_favorites', (table) => {
      table.increments('id_bengkel_favorite')
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('bengkel_favorites')
  }
}

module.exports = BengkelFavoriteSchema
