'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderService extends Model {

    static get primaryKey() {
        return 'id_order_service'
    }

    user() {
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

    outlet() {
        return this.belongsTo('App/Models/MitraOutlet', 'id_mitra', 'id_mitra')
    }

    merkKendaraan(){
        return this.belongsTo('App/Models/MerkKendaraan', 'id_merk_kendaraan', 'id_merk_kendaraan')
    }

    tipeKendaraan(){
        return this.belongsTo('App/Models/TipeKendaraan', 'id_tipe_kendaraan', 'id_tipe_kendaraan')
    }

    detailOrder(){
        return this.hasMany('App/Models/DetailOrderService', 'id_order_service', 'id_order_service')
    }

}

module.exports = OrderService
