'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RatingProduk extends Model {
    static get primaryKey(){
        return 'id_rating_produk'
    }

    produk(){
        return this.belongsTo('App/Models/Produk')
    }

    user(){
        return this.belongsTo('App/Models/User')
    }
}

module.exports = RatingProduk
