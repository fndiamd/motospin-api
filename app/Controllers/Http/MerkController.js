'use strict'

const Merk = use('App/Models/MerkProduk')

class MerkController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'
            const result = await Merk
                .query()
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)
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
            const thisData = await Merk.findOrFail(params.id)
            return response.json(thisData)
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
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
        }

        const checkExists = await Merk.findBy('merk_produk', data.merk_produk)
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
        try {
            const dataUpdate = {
                merk_produk: request.input('merk_produk'),
                merk_status: request.input('merk_status')
            }
    
            const thisData = await Merk.findOrFail(params.id)
            const checkExists = await Merk.findBy('merk_produk', dataUpdate.merk_produk)
            if (checkExists && thisData.merk_produk != dataUpdate.merk_produk) {
                return response.status(404).send({ message: 'Merk sudah ada!' })
            }

            thisData.merk_produk = dataUpdate.merk_produk
            thisData.merk_status = dataUpdate.merk_status

            await thisData.save()
            return thisData
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ params, response }) {
        try {
            const thisData = await Merk.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Merk berhasil dihapus' })
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = MerkController
