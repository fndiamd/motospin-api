'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BengkelFavorite extends Model {
    
    static get primaryKey(){
        return 'id_bengkel_favorite'
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet', 'id_mitra', 'id_mitra')
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

}

module.exports = BengkelFavorite
