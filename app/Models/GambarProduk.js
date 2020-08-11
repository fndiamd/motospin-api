'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GambarProduk extends Model {
    static get primaryKey(){
        return 'id_gambar_produk'
    }

    produk(){
        return this.belongsTo('App/Models/Produk')
    }
}

module.exports = GambarProduk
