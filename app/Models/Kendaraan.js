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

}

module.exports = Kendaraan
