'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Hash = use('Hash')

class MitraOwner extends Model {

    static get primaryKey() {
        return 'id_owner'
    }

    static get hidden(){
        return ['owner_password', 'owner_ktp']
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

    firebaseTokens() {
        return this.hasMany('App/Models/FirebaseTokenOwner')
    }

    kodeOwner() {
        return this.hasMany('App/Models/KodeOwner')
    }

    outlet() {
        return this.hasOne('App/Models/MitraOutlet', 'id_owner', 'id_owner')
    }

    dompet(){
        return this.hasMany('App/Models/DompetOwner', 'id_owner', 'id_owner')
    }
}

module.exports = MitraOwner
