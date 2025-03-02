'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KategoriProduk extends Model {
    static get primaryKey(){
        return 'id_kategori_produk'
    }

    produk(){
        return this.hasMany('App/Models/Produk')
    }
}

module.exports = KategoriProduk
