'use strict'

const Kategori = use('App/Models/KategoriProduk')

class KategoriController {

    async index({ params, request, response }) {
        try {
            const page = params.page || 1
            const result = await Kategori
                .query()
                .where({ id_mitra: request.input('id_mitra') })
                .orderBy('created_at', 'desc')
                .paginate(page, 5)
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ params, response, request }) {
        try {
            const thisData = await Kategori.query()
                .where({
                    id_mitra: request.input('id_mitra'),
                    id_kategori_produk: params.id
                })
                .first()

            if (!thisData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return response.json(thisData)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response }) {
        const data = {
            kategori_produk: request.input('kategori_produk'),
            kategori_status: 1,
            id_mitra: request.input('id_mitra')
        }

        const checkExists = await Kategori
            .query()
            .where({
                kategori_produk: request.input('kategori_produk'),
                id_mitra: request.input('id_mitra')
            }).first()
        if (checkExists) {
            return response.status(404).send({ message: 'Kategori sudah ada!' })
        }

        try {
            const exec = await Kategori.create(data)
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ request, response, params }) {
        const dataUpdate = {
            kategori_produk: request.input('kategori_produk'),
            kategori_status: request.input('kategori_status')
        }

        const checkExists = await Kategori
            .query()
            .where({
                kategori_produk: request.input('kategori_produk'),
                id_mitra: request.input('id_mitra')
            }).first()
        if (checkExists) {
            return response.status(404).send({ message: 'Kategori sudah ada!' })
        }

        try {
            const updating = await Kategori.query()
                .where({ id_mitra: request.input('id_mitra'), id_kategori_produk: params.id })
                .update(dataUpdate)

            if (!updating) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return await Kategori.find(params.id)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ request, response, params }) {
        try {
            const thisData = await Kategori.query()
                .where({ id_mitra: request.input('id_mitra'), id_kategori_produk: params.id })
                .first()
            if (!thisData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            const kategori = await Kategori.find(params.id)
            await kategori.delete()
            return response.json({ message: 'success' })
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = KategoriController
