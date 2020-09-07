'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up() {
    this.create('messages', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('room_id')
        .references('uuid')
        .inTable('room_chats')
        .onDelete('CASCADE')
      table.string('sender').notNullable()
      table.text('message').notNullable()
    })
  }

  down() {
    this.drop('messages')
  }
}

module.exports = MessageSchema
