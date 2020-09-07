'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Message extends Model {
    
    room(){
        return this.belongsTo('App/Models/Room', 'room_id', 'uuid')
    }

}

module.exports = Message
