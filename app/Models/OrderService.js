'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderService extends Model {

    static get primaryKey() {
        return 'id_order_service'
    }

    jenisLayanan() {
        return this.belongsTo('App/Models/JenisLayanan')
    }

    user() {
        return this.belongsTo('App/Models/User')
    }

    outlet() {
        return this.belongsTo('App/Models/MitraOutlet')
    }

}

module.exports = OrderService
