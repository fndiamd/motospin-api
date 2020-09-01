'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HistoriDompetOwner extends Model {
    static get primaryKey(){
        return 'id_histori'
    }

    dompet(){
        return this.belongsTo('App/Models/DompetOwner', 'id_dompet', 'id_dompet')
    }
}

module.exports = HistoriDompetOwner
