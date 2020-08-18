'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderService extends Model {

    static get primaryKey() {
        return 'id_order_service'
    }

    user() {
        return this.belongsTo('App/Models/User')
    }

    outlet() {
        return this.belongsTo('App/Models/MitraOutlet')
    }

    merkKendaraan(){
        return this.belongsTo('App/Models/MerkKendaraan')
    }

    tipeKendaraan(){
        return this.belongsTo('App/Models/TipeKendaraan')
    }

}

module.exports = OrderService
