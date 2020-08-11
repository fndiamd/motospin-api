'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  static get primaryKey() {
    return 'id_user'
  }

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.user_password) {
        userInstance.user_password = await Hash.make(userInstance.user_password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  kodeUser() {
    return this.hasMany('App/Models/KodeUser')
  }

  kendaraan() {
    return this.hasMany('App/Models/Kendaraan')
  }

  cart(){
    return this.hasMany('App/Models/KeranjangBelanja')
  }

  orderService(){
    return this.hasMany('App/Models/OrderService')
  }

  orderSparepart(){
    return this.hasMany('App/Models/OrderSparepart')
  }

  sewaRental(){
    return this.hasMany('App/Models/SewaRental')
  }

  rating(){
    return this.hasMany('App/Models/RatingProduk')
  }
}

module.exports = User
