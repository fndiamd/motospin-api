'use strict'

const Cart = use('App/Models/KeranjangProduk')
const Produk = use('App/Models/Produk')

class CartController {

    async groupItemBy(array, property) {
        var hash = {},
            props = property.split('.');
        for (var i = 0; i < array.length; i++) {
            var key = props.reduce(function (acc, prop) {
                return acc && acc[prop];
            }, array[i]);
            if (!hash[key]) hash[key] = [];
            hash[key].push(array[i]);
        }
        return hash;
    }

    async index({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const result = await Cart.query()
                .with('produk.outlet')
                .with('produk.gambar')
                .orderBy('created_at', 'desc')
                .where({ id_user: authData.id_user }).fetch()

            const group = await this.groupItemBy(result.toJSON(), 'produk.id_mitra');
            return response.json(group)
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
                await Cart.query().where('id_keranjang_produk', checkExists.id_keranjang_produk).update({ jumlah: checkExists.jumlah + data.jumlah })
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

    async update({ params, response, request }) {
        try {
            const thisData = await Cart.findOrFail(params.id)
            thisData.jumlah = request.input('jumlah')
            await thisData.save()
            const result = await Cart.query().with('produk').where('id_keranjang_produk', params.id).first()
            return response.json(result)
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ params, response }) {
        try {
            const thisData = await Cart.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Produk berhasil dihapus dari keranjang' })
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = CartController
