'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class MitraPegawai extends Model {

    static get primaryKey() {
        return 'id_pegawai'
    }

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.pegawai_password) {
                userInstance.pegawai_password = await Hash.make(userInstance.pegawai_password)
            }
        })

    }

    tokens() {
        return this.hasMany('App/Models/TokenPegawai', 'id_pegawai', 'pegawai_id')
    }

    outlet(){
        return this.belongsTo('App/Models/MitraOutlet')
    }

}

module.exports = MitraPegawai
