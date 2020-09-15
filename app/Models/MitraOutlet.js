'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MitraOutlet extends Model {

    static get primaryKey(){
        return 'id_mitra'
    }

    jenisMitra(){
        return this.belongsTo('App/Models/JenisMitra', 'id_jenis_mitra', 'id_jenis_mitra')
    }

    owner(){
        return this.belongsTo('App/Models/MitraOwner', 'id_owner', 'id_owner')
    }

    kategoriProduk(){
        return this.hasMany('App/Models/KategoriProduk')
    }

    merkProduk(){
        return this.hasMany('App/Models/MerkProduk')
    }

    produk(){
        return this.hasMany('App/Models/Produk')
    }

    orderProduk(){
        return this.hasMany('App/Models/OrderProduk')
    }

    orderService(){
        return this.hasMany('App/Models/OrderService')
    }

}

module.exports = MitraOutlet
