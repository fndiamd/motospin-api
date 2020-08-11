'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kendaraan extends Model {

    static get primaryKey(){
        return 'id_kendaraan'
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

    merk(){
        return this.belongsTo('App/Models/MerkKendaraan', 'id_merk_kendaraan', 'id_merk_kendaraan')
    }

    tipe(){
        return this.belongsTo('App/Models/TipeKendaraan', 'id_tipe_kendaraan', 'id_tipe_kendaraan')
    }

}

module.exports = Kendaraan
