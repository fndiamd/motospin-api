'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MerkProduk extends Model {
    static get primaryKey(){
        return 'id_merk_produk'
    }
}

module.exports = MerkProduk
