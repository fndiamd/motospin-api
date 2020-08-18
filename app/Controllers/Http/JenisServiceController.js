'use strict'

const JenisService = use('App/Models/JenisService')
const Env = use('Env')
const Helpers = use('Helpers')

class JenisServiceController {

    async index({ response }) {
        try {
            const result = await JenisService.query().with('tipeService').fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ response, params }) {
        try {
            const thisData = await JenisService.findOrFail(params.id)
            return response.json(thisData)
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response }) {
        try {
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })

            let nameLogo = logoFile.clientName

            const data = {
                jenis_service: request.input('jenis_service'),
                jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/${nameLogo}`,
                id_jenis_mitra: request.input('id_jenis_mitra')
            }

            const checkExists = await JenisService.findBy('jenis_service', data.jenis_service)
            if (checkExists) {
                return response.status(400).send({ message: 'Jenis Service sudah ada!' })
            }

            await logoFile.move(Helpers.publicPath('uploads/jenis-service'), {
                name: nameLogo,
                overwrite: true
            })

            if (!logoFile.moved()) {
                return logoFile.error()
            }

            const exec = await JenisService.create(data)
            return exec

        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ request, response, params }) {
        try {
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })

            let nameLogo = logoFile.clientName

            const dataUpdate = {
                jenis_service: request.input('jenis_service'),
                id_jenis_mitra: request.input('id_jenis_mitra')
            }

            const thisData = await JenisService.findOrFail(params.id)
            const checkExists = await JenisService.findBy('jenis_service', data.jenis_service)
            if (checkExists && thisData.jenis_service != data.jenis_service) {
                return response.status(400).send({ message: 'Jenis Service sudah ada!' })
            }

            if (request.file('logo_file') != null) {
                await logoFile.move(Helpers.publicPath('uploads/jenis-service'), {
                    name: nameLogo,
                    overwrite: true
                })

                if (!logoFile.moved()) {
                    return logoFile.error()
                }

                thisData.jenis_service_img_path = `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/${nameLogo}`
            }

            thisData.jenis_service = dataUpdate.jenis_service
            thisData.id_jenis_mitra = dataUpdate.id_jenis_mitra

            await thisData.save()
            return response.json(thisData)

        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ response, params }){
        try {
            const thisData = await JenisService.findOrFail(params.id)
            thisData.delete()
            return response.json({ message: 'Data berhasil dihapus' })
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async serviceMitra({ request, response }){
        try {
            const result = await JenisService.query().with('tipeService').where({ id_jenis_mitra : request.input('id_jenis_mitra')}).fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/jenis-service/${params.file}`))
    }

}

module.exports = JenisServiceController
