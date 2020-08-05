'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderSparepart extends Model {

    static get primaryKey(){
        return 'id_order_sparepart'
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

module.exports = OrderSparepart
