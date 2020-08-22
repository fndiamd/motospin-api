'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeranjangProduk extends Model {
    static get table() {
        return 'keranjang_produks'
    }

    static get primaryKey(){
        return 'id_keranjang_produk'
    }

    produk(){
        return this.belongsTo('App/Models/Produk', 'id_produk', 'id_produk')
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }
}

module.exports = KeranjangProduk
