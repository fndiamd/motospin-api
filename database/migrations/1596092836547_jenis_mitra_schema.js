'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JenisMitraSchema extends Schema {
  up () {
    this.create('jenis_mitras', (table) => {
      table.increments('id_jenis_mitra')
      table.string('jenis_mitra', 50)
      table.string('jenis_mitra_img_path', 200)
      table.timestamps()
    })
  }

  down () {
    this.drop('jenis_mitras')
  }
}

module.exports = JenisMitraSchema
