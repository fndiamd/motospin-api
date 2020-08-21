'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Admin extends Model {
    static get primaryKey() {
        return 'id_admin'
    }

    static boot() {
        super.boot()

        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.admin_password) {
                userInstance.admin_password = await Hash.make(userInstance.admin_password)
            }
        })
    }

    tokens(){
        return this.hasMany('App/Models/TokenAdmin')
    }
}

module.exports = Admin
