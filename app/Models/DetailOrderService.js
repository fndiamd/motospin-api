'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DetailOrderService extends Model {

    static get primaryKey(){
        return 'id_detail_order_service'
    }

    tipeService(){
        return this.belongsTo('App/Models/TipeService', 'id_tipe_service', 'id_tipe_service')
    }

}

module.exports = DetailOrderService
