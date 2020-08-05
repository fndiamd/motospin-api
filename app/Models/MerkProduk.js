'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MerkProduk extends Model {
    static get primaryKey(){
        return 'id_merk_produk'
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet')
    }

    produk(){
        return this.hasMany('App/Models/Produk')
    }
}

module.exports = MerkProduk
