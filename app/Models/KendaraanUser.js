'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KendaraanUser extends Model {

    static get table(){
        return 'kendaraan_users'
    }

    static get primaryKey(){
        return 'id_kendaraan_user'
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

module.exports = KendaraanUser
