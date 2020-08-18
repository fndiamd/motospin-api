'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceBengkel extends Model {
    static get primaryKey(){
        return 'id_service_bengkel'
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet', 'id_mitra', 'id_mitra')
    }

    service(){
        return this.belongsTo('App/Models/JenisService', 'id_jenis_service', 'id_jenis_service')
    }
}

module.exports = ServiceBengkel
