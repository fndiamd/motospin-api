'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DetailOrderSparepart extends Model {

    static get primaryKey(){
        return 'id_order_detail'
    }

    order(){
        return this.belongsTo('App/Models/OrderSparepart')
    }

    produk(){
        return this.belongsTo('App/Models/Produk')
    }

}

module.exports = DetailOrderSparepart
