'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderProduk extends Model {

    static get primaryKey(){
        return 'id_order_produk'
    }

    user(){
        this.belongsTo('App/Models/User')
    }

    outlet(){
        this.belongsTo('App/Models/MitraOutlet')
    }

    detailOrder(){
        this.hasMany('App/Model/DetailOrderSparepart')
    }

}

module.exports = OrderProduk
