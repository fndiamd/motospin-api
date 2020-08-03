'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JenisMitra extends Model {

    static get primaryKey(){
        return 'id_jenis_mitra'
    }

}

module.exports = JenisMitra
