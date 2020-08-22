'use strict'

const Cart = use('App/Models/KeranjangProduk')

class CartController {

    async index({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const result = await Cart.query().with('produk').where({ id_user: authData.id_user }).fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response, auth }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const data = {
                id_user: authData.id_user,
                id_produk: request.input('id_produk'),
                jumlah: request.input('jumlah')
            }

            let id_keranjang_produk = 0;
            const checkExists = await Cart.query().where({ id_user: data.id_user, id_produk: data.id_produk }).first()
            if (checkExists) {
                await Cart.query().where('id_keranjang_produk', checkExists.id_keranjang_produk).update({ jumlah: checkExists.jumlah + data.jumlah})
                id_keranjang_produk = checkExists.id_keranjang_produk
            } else {
                const storeData = await Cart.create(data)
                id_keranjang_produk = storeData.id_keranjang_produk
            }
            const thisData = await Cart.query().with('produk').where('id_keranjang_produk', id_keranjang_produk).first()
            return response.json(thisData)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = CartController
