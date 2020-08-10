'use strict'

const JenisMitra = use('App/Models/JenisMitra')
const Helpers = use('Helpers')
const Env = use('Env')

class JenisMitraController {

    async index({ response }) {
        try {
            const result = await JenisMitra.query().orderBy('created_at', 'asc').fetch()
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
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })
            let nameLogo = request.input('jenis_mitra') + '.png'

            let checkExists = await JenisMitra.findBy('jenis_mitra', request.input('jenis_mitra'))
            if (checkExists) {
                return response.status(400).send({ message: 'Jenis mitra sudah ada!' })
            }

            try {
                await logoFile.move(Helpers.publicPath('uploads/jenis_mitra'), {
                    name: nameLogo,
                    overwrite: true
                })
            } catch (error) {
                return error.message
            }

            if (!logoFile.moved()) {
                return logoFile.error()
            }

            let exec = await JenisMitra.create({
                'jenis_mitra': request.input('jenis_mitra'),
                'jenis_mitra_img_path': `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/${nameLogo}`
            })

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
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })
            let nameLogo = request.input('jenis_mitra') + '.png'

            const thisData = await JenisMitra.findOrFail(params.id)
            let checkExists = await JenisMitra.findBy('jenis_mitra', request.input('jenis_mitra'))
            if (checkExists && thisData.jenis_mitra !== request.input('jenis_mitra')) {
                return response.status(400).send({ message: 'Jenis mitra sudah ada!' })
            }

            if (request.file('logo_file') != null) {
                try {
                    await logoFile.move(Helpers.publicPath('uploads/jenis_mitra'), {
                        name: nameLogo,
                        overwrite: true
                    })
                } catch (error) {
                    return error.message
                }

                if (!logoFile.moved()) {
                    return logoFile.error()
                }
                thisData.jenis_mitra_img_path = `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/${nameLogo}`
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

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/jenis_mitra/${params.file}`))
    }

}

module.exports = JenisMitraController
