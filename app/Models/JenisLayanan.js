'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JenisLayanan extends Model {
    static get primaryKey() {
        return 'id_jenis_layanan'
    }

    orderService(){
        return this.hasMany('App/Models/OrderService')
    }
}

module.exports = JenisLayanan
