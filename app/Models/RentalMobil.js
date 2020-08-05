'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RentalMobil extends Model {
    static get primaryKey(){
        return 'rental_nopol'
    }

    harga(){
        return this.hasMany('App/Models/RentalHarga')
    }

    sewa(){
        return this.hisMany('App/Models/SewaRetal')
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet')
    }
}

module.exports = RentalMobil
