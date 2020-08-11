'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipeKendaraan extends Model {

    static get primaryKey(){
        return 'id_tipe_kendaraan'
    }

    merk(){
        return this.belongsTo('App/Models/MerkKendaraan', 'id_merk_kendaraan', 'id_merk_kendaraan')
    }

    kendaraan(){
        return this.hasMany('App/Models/Kendaraan')
    }

}

module.exports = TipeKendaraan
