'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KompatibelProduk extends Model {
    static get primaryKey(){
        return 'id_kompatibel_produk'
    }

    produk(){
        return this.belongsTo('App/Models/Produk')
    }

    tipeKendaraan(){
        return this.belongsTo('App/Models/TipeKendaraan')
    }
}

module.exports = KompatibelProduk
