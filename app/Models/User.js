'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  static get primaryKey() {
    return 'id_user'
  }

  static get hidden(){
    return ['user_password']
  }

  static boot() {
    super.boot()

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.user_password) {
        userInstance.user_password = await Hash.make(userInstance.user_password)
      }
    })
  }

  tokens() {
    return this.hasMany('App/Models/Token')
  }

  firebaseTokens(){
    return this.hasMany('App/Models/FirebaseTokenUser')
  }

  kodeUser() {
    return this.hasMany('App/Models/KodeUser')
  }

  kendaraan() {
    return this.hasMany('App/Models/KendaraanUser')
  }

  keranjangProduk(){
    return this.hasMany('App/Models/KeranjangProduk')
  }

  keranjangService(){
    return this.hasMany('App/Models/KeranjangService')
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

  alamat(){
    return this.hasMany('App/Models/AlamatUser')
  }
}

module.exports = User
