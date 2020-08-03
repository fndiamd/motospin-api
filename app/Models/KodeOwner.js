'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KodeOwner extends Model {

    static get primaryKey() {
        return 'id_kode_owner'
    }

}

module.exports = KodeOwner
