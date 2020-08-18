'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipeService extends Model {
    static get primaryKey() {
        return 'id_tipe_service'
    }

    jenisService(){
        return this.belongsTo('App/Models/JenisService')
    }
}

module.exports = TipeService
