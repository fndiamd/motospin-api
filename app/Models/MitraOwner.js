'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Hash = use('Hash')

class MitraOwner extends Model {

    static get primaryKey() {
        return 'id_owner'
    }

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.owner_password) {
                userInstance.owner_password = await Hash.make(userInstance.owner_password)
            }
        })

    }

    tokens() {
        return this.hasMany('App/Models/TokenOwner', 'id_owner', 'owner_id')
    }

    kodeOwner() {
        return this.hasMany('App/Models/KodeOwner')
    }

    outlet(){
        return this.hasMany('App/Models/MitraOutlet')
    }
}

module.exports = MitraOwner
