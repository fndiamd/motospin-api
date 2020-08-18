'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeranjangService extends Model {
    static get primaryKey() {
        return 'id_keranjang_service'
    }
}

module.exports = KeranjangService
