'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RoomChat extends Model {
    static get hidden(){
        return ['id']
    }

    static get primaryKey(){
        return 'uuid'
    }

    messages(){
        return this.hasMany('App/Models/Message', 'uuid', 'room_id')
    }

    user(){
        return this.belongsTo('App/Models/User', 'id_user', 'id_user')
    }

    owner(){
        return this.belongsTo('App/Models/MitraOwner', 'id_owner', 'id_owner')
    }

}

module.exports = RoomChat
