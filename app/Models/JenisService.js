'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JenisService extends Model {
    
    static get primaryKey() {
        return 'id_jenis_service'
    }

    jenisMitra(){
        return this.belongsTo('App/Models/JenisMitra', 'id_jenis_mitra', 'id_jenis_mitra')
    }

    tipeService(){
        return this.hasMany('App/Models/TipeService', 'id_jenis_service', 'id_jenis_service')
    }

}

module.exports = JenisService
