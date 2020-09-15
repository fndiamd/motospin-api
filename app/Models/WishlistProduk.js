'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class WishlistProduk extends Model {

    static get primaryKey(){
        return 'id_wishlist'
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

    produk(){
        return this.belongsTo('App/Models/Produk', 'id_produk', 'id_produk')
    }

}

module.exports = WishlistProduk
