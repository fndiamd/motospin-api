'use strict'

const Merk = use('App/Models/MerkProduk')

class MerkController {

    async index({ params, request, response }) {
        try {
            const page = params.page || 1
            const result = await Merk
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

    async view({ params, request, response }) {
        try {
            const thisData = await Merk.query()
                .where({
                    id_mitra: request.input('id_mitra'),
                    id_merk_produk: params.id
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
            merk_produk: request.input('merk_produk'),
            merk_status: 1,
            id_mitra: request.input('id_mitra')
        }

        const checkExists = await Merk
            .query()
            .where({
                merk_produk: request.input('merk_produk'),
                id_mitra: request.input('id_mitra')
            }).first()
        if (checkExists) {
            return response.status(404).send({ message: 'Merk sudah ada!' })
        }

        try {
            const exec = await Merk.create(data)
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ params, request, response }) {
        const dataUpdate = {
            merk_produk: request.input('merk_produk'),
            merk_status: request.input('merk_status')
        }

        const checkExists = await Merk
            .query()
            .where({
                merk_produk: request.input('merk_produk'),
                id_mitra: request.input('id_mitra')
            }).first()
        if (checkExists) {
            return response.status(404).send({ message: 'Merk sudah ada!' })
        }

        try {
            const updating = await Merk.query()
                .where({ id_mitra: request.input('id_mitra'), id_merk_produk: params.id })
                .update(dataUpdate)

            if (!updating) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return await Merk.find(params.id)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ params, request, response }) {
        try {
            const thisData = await Merk.query()
                .where({ id_mitra: request.input('id_mitra'), id_merk_produk: params.id })
                .first()
            if (!thisData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            const merk = await Merk.find(params.id)
            await merk.delete()
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

module.exports = MerkController
