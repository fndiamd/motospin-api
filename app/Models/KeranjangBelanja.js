'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeranjangBelanja extends Model {
    static get primaryKey(){
        return 'id_keranjang'
    }
}

module.exports = KeranjangBelanja
