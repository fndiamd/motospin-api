'use strict'

const Wishlist = use('App/Models/WishlistProduk')

class WishlistProdukController {

    async index({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const pagination = request.only(['page', 'limit', 'sort', 'column'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let sort = pagination.sort || 'desc'
            let column = pagination.column || 'created_at'

            const wishlist = await Wishlist
                .query()
                .with('produk.outlet')
                .with('produk.gambar')
                .with('produk.kategori')
                .with('produk.merk')
                .where({ id_user: authData.id_user })
                .orderBy(column, sort)
                .paginate(page, limit)
            return response.ok(wishlist)
        } catch (error) {
            return response.conflict({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const produk = request.input('id_produk')

            const checkExists = await Wishlist
                .query()
                .where({
                    id_user: authData.id_user,
                    id_produk: produk
                })
                .first()

            if (checkExists)
                return response.badRequest({ message: 'Produk sudah terdaftar pada wishlist anda' })

            const data = await Wishlist.create({
                id_user: authData.id_user,
                id_produk: produk
            })

            return response.created(data)
        } catch (error) {
            return response.conflict({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const produk = request.input('id_produk')

            const thisData = await Wishlist
                .findBy({
                    id_user: authData.id_user,
                    id_produk: produk
                })

            if (!thisData)
                return response.badRequest({ message: 'Produk tidak terdaftar pada wishlist anda' })

            await thisData.delete()
            return response.accepted({ message: 'Produk dihapus dari wishlist' })
        } catch (error) {
            return response.conflict({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = WishlistProdukController
