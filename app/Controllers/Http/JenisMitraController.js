'use strict'

const JenisMitra = use('App/Models/JenisMitra')

class JenisMitraController {

    async index({ response }) {
        try {
            const result = await JenisMitra.query().orderBy('created_at', 'desc').fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ params, response }) {
        try {
            const thisData = await JenisMitra.findOrFail(params.id)
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
            let checkExists = await JenisMitra.findBy('jenis_mitra', request.input('jenis_mitra'))
            if (checkExists) {
                return response.status(400).send({ message: 'Jenis mitra sudah ada!' })
            }

            let exec = await JenisMitra.create({ 'jenis_mitra': request.input('jenis_mitra') })
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ params, response, request }) {
        try {
            const thisData = await JenisMitra.findOrFail(params.id)
            let checkExists = await JenisMitra.findBy('jenis_mitra', request.input('jenis_mitra'))
            if (checkExists) {
                return response.status(400).send({ message: 'Jenis mitra sudah ada!' })
            }
            
            thisData.jenis_mitra = request.input('jenis_mitra')
            await thisData.save()
            return thisData
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({ message: 'Data tidak ditemukan!' })
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
            const thisData = await JenisMitra.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'success' })
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({ message: 'Data tidak ditemukan!' })
            }
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = JenisMitraController
