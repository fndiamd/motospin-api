'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Produk extends Model {
    static get primaryKey(){
        return 'id_produk'
    }
}

module.exports = Produk
