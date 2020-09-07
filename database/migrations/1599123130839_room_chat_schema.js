'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomChatSchema extends Schema {
  up() {
    this.create('room_chats', (table) => {
      table.increments()
      table.timestamps()
      table.integer('id_user')
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('id_owner')
        .references('id_owner')
        .inTable('mitra_owners')
        .onDelete('CASCADE')
      table.uuid('uuid').unique()
    })
  }

  down() {
    this.drop('room_chats')
  }
}

module.exports = RoomChatSchema
