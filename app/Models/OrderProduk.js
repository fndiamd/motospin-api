'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderProduk extends Model {

    static get primaryKey(){
        return 'id_order_produk'
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet', 'id_mitra', 'id_mitra')
    }

    detailOrder(){
        return this.hasMany('App/Models/DetailOrderProduk', 'id_order_produk', 'id_order_produk')
    }

    payment(){
        return this.hasOne('App/Models/PaymentProduk', 'id_order_produk', 'id_order_produk')
    }

    ekspedisi(){
        return this.hasOne('App/Models/PengirimanProduk', 'id_order_produk', 'id_order_produk')
    }

}

module.exports = OrderProduk
