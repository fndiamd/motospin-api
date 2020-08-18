'use strict'

const ServiceBengkel = use('App/Models/ServiceBengkel')

class ServiceBengkelController {
    async index({ request, response }) {
        try {
            const id_mitra = request.input('id_mitra')
            const result = await ServiceBengkel.query().with('outlet').with('service').where({ id_mitra: id_mitra}).fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response }){
        try {
            const data = {
                id_mitra: request.input('id_mitra'),
                id_jenis_service: request.input('id_jenis_service')
            }

            const checkExists = await ServiceBengkel.query().where({
                id_mitra: data.id_mitra,
                id_jenis_service: data.id_jenis_service
            }).first()

            if(checkExists){
                return response.status(400).send({ message: 'Data sudah ada' })
            }

            const exec = await ServiceBengkel.create(data)
            return response.json(exec)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ response, params }){
        try {
            const thisData = await ServiceBengkel.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Data berhasil dihapus' })
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }
}

module.exports = ServiceBengkelController
