'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeranjangProduk extends Model {
    static get primaryKey(){
        return 'id_keranjang_produk'
    }

    user(){
        return this.belongsTo('App/Models/User')
    }

    produk(){
        return this.belongsTo('App/Models/Produk')
    }
}

module.exports = KeranjangProduk
