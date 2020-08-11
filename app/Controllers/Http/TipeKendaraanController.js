'use strict'

const TipeKendaraan = use('App/Models/TipeKendaraan')

class TipeKendaraanController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const result = await TipeKendaraan
                .query()
                .with('merk')
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

    async view({ response, params }) {
        try {
            const thisData = await TipeKendaraan.findOrFail(params.id)
            return response.json(thisData)
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
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
        try {
            const data = {
                id_merk_kendaraan: request.input('id_merk_kendaraan'),
                tipe_kendaraan: request.input('tipe_kendaraan')
            }
            const checkExists = await TipeKendaraan.query().where({
                id_merk_kendaraan: data.id_merk_kendaraan,
                tipe_kendaraan: data.tipe_kendaraan
            }).first()

            if (checkExists) {
                return response.status(400).send({ message: 'Data sudah ada' })
            }

            const exec = await TipeKendaraan.create(data)
            return response.json(exec)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ request, response, params }) {
        try {
            const thisData = await TipeKendaraan.findOrFail(params.id)
            const checkExists = await TipeKendaraan.query().where({
                id_merk_kendaraan: request.input('id_merk_kendaraan'),
                tipe_kendaraan: request.input('tipe_kendaraan')
            }).first()
            if (checkExists && thisData.tipe_kendaraan != request.input('tipe_kendaraan')) {
                return response.status(400).send({ message: 'Data sudah ada' })
            }

            thisData.id_merk_kendaraan = request.input('id_merk_kendaraan')
            thisData.tipe_kendaraan = request.input('tipe_kendaraan')
            await thisData.save()
            return response.json(thisData)
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
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
            const thisData = await TipeKendaraan.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Data berhasil dihapus' })
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async searchByMerk({ request, response }){
        try {
            const result = await TipeKendaraan.query().where('id_merk_kendaraan', request.input('id_merk_kendaraan')).fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = TipeKendaraanController
