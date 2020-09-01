'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DompetOwner extends Model {
    static get primaryKey(){
        return 'id_dompet'
    }

    owner(){
        return this.belongsTo('App/Models/MitraOwner', 'id_owner', 'id_owner')
    }
}

module.exports = DompetOwner
