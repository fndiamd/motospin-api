'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KodeUser extends Model {

    static get primaryKey(){
        return 'id_kode_user'
    }

}

module.exports = KodeUser
