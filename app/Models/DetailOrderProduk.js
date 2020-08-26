'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DetailOrderProduk extends Model {

    static get primaryKey(){
        return 'id_detail_order_produk'
    }

    order(){
        return this.belongsTo('App/Models/OrderProduk')
    }

    produk(){
        return this.belongsTo('App/Models/Produk', 'id_produk', 'id_produk')
    }

}

module.exports = DetailOrderProduk
