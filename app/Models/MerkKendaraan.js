'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MerkKendaraan extends Model {
    static get primaryKey(){
        return 'id_merk_kendaraan'
    }

    tipe(){
        return this.hasMany('App/Models/TipeKendaraan')
    }

    kendaraan(){
        return this.hasMany('App/Models/MerkKendaraan')
    }
}

module.exports = MerkKendaraan
