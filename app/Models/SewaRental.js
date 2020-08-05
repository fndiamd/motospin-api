'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SewaRental extends Model {
    static get primaryKey() {
        return 'id_sewa'
    }

    user(){
        this.belongsTo('App/Models/User')
    }

    outlet(){
        this.belongsTo('App/Models/MitraOutlet')
    }

    rentalMobil(){
        this.belongsTo('App/Models/RentalMobil')
    }
}

module.exports = SewaRental
