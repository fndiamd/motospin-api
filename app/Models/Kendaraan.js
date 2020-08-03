'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kendaraan extends Model {

    static get primaryKey(){
        return 'kendaraan_nopol'
    }

}

module.exports = Kendaraan
