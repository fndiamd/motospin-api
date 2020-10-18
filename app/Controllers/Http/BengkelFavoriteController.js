'use strict'

const BengkelFavorite = use('App/Models/BengkelFavorite')

class BengkelFavoriteController {

    async index({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const paginataion = request.only(['page', 'column', 'limit', 'sort'])

            let page = paginataion.page || 1
            let column = paginataion.column || 'created_at'
            let limit = paginataion.limit | 5
            let sort = paginataion.sort || 'asc'

            const favorite = await BengkelFavorite
                .query()
                .where({ id_user: authData.id_user })
                .with('outlet')
                .orderBy(column, sort)
                .paginate(page, limit)

            return response.ok(favorite)
        } catch (error) {
            return response.conflict({
                status: error.status,
                erorr: error.name,
                message: error.message
            })
        }
    }

    async store({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const bengkel = request.input('id_mitra')

            const checkExists = await BengkelFavorite.findByOrFail({
                id_user: authData.id_user,
                id_mitra: bengkel
            })

            if (checkExists)
                return response.badRequest({ message: 'Bengkel sudah difavoritkan' })

            const data = await BengkelFavorite.create({
                id_user: authData.id_user,
                id_mitra: bengkel
            })

            return response.created(data)
        } catch (error) {
            return response.conflict({
                status: error.status,
                erorr: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const bengkel = request.input('id_mitra')

            const thisData = await BengkelFavorite
                .findByOrFail({
                    id_user: authData.id_user,
                    id_mitra: bengkel
                })

            if (!thisData)
                return response.badRequest({ message: 'Bengkel tidak ada dalam daftar favorite' })

            await thisData.delete()
            return response.ok({ message: 'Bengkel dihapus dari daftar favorite' })
        } catch (error) {
            return response.conflict({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = BengkelFavoriteController
