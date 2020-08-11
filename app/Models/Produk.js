'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Produk extends Model {
    static get primaryKey(){
        return 'id_produk'
    }

    merk(){
        return this.belongsTo('App/Models/MerkProduk', 'id_merk_produk', 'id_merk_produk')
    }

    kategori(){
        return this.belongsTo('App/Models/KategoriProduk', 'id_kategori_produk', 'id_kategori_produk')
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet', 'id_mitra', 'id_mitra')
    }

    cart(){
        return this.hasMany('App/Models/KeranjangBelanja')
    }

    detailOrder(){
        return this.hasMany('App/Models/DetailOrderSparepart')
    }

    rating(){
        return this.hasMany('App/Models/RatingProduk')
    }

    gambar(){
        return this.hasMany('App/Models/GambarProduk')
    }
}

module.exports = Produk
