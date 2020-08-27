'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PengirimanProduk extends Model {

    static get primaryKey(){
        return 'id'
    }

    order() {
        return this.belongsTo('App/Models/OrderProduk', 'id_order_produk', 'id_order_produk')
    }

}

module.exports = PengirimanProduk
