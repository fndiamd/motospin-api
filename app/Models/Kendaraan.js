'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kendaraan extends Model {

    static get primaryKey(){
        return 'kendaraan_nopol'
    }

    user(){
        return this.belongsTo('App/Models/User')
    }

}

module.exports = Kendaraan
