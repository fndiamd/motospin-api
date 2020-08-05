'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Produk extends Model {
    static get primaryKey(){
        return 'id_produk'
    }

    merk(){
        return this.belongsTo('App/Models/MerkProduk')
    }

    kategori(){
        return this.belongsTo('App/Models/KategoriProduk')
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet')
    }

    cart(){
        return this.hasMany('App/Models/KeranjangBelanja')
    }

    detailOrder(){
        return this.hasMany('App/Models/DetailOrderSparepart')
    }
}

module.exports = Produk
