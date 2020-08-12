'use strict'

const MerkKendaraan = use('App/Models/MerkKendaraan')
const Helpers = use('Helpers')
const Env = use('Env')

class MerkKendaraanController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const result = await MerkKendaraan
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

    async view({ params, response }) {
        try {
            const thisData = await MerkKendaraan.findOrFail(params.id)
            return response.json(thisData)
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
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
            let nameLogo = logoFile.clientName

            const checkExists = await MerkKendaraan.findBy('merk_kendaraan', request.input('merk_kendaraan'))
            if(checkExists){
                return response.status(400).send({ message: 'Merk Kendaraan sudah ada!' })
            }

            await logoFile.move(Helpers.publicPath('uploads/merk-kendaraan'), {
                name: nameLogo,
                overwrite: true
            })

            if(!logoFile.moved()){
                return logoFile.error()
            }

            const exec = await MerkKendaraan.create({ 
                merk_kendaraan: request.input('merk_kendaraan'),
                merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/${nameLogo}`
            })

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
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })
            let nameLogo = logoFile.clientName

            const thisData = await MerkKendaraan.findOrFail(params.id)
            const checkExists = await MerkKendaraan.findBy('merk_kendaraan', request.input('merk_kendaraan'))
            if(checkExists && thisData.merk_kendaraan != request.input('merk_kendaraan')){
                return response.status(400).send({ message: 'Merk Kendaraan sudah ada!' })
            }

            if(request.file('logo_file') != null){
                try {
                    await logoFile.move(Helpers.publicPath('uploads/merk-kendaraan'), {
                        name: nameLogo,
                        overwrite: true
                    })
                } catch (error) {
                    return error.message
                }

                if (!logoFile.moved()) {
                    return logoFile.error()
                }

                thisData.merk_kendaraan_img_path = `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/${nameLogo}`
            }

            thisData.merk_kendaraan = request.input('merk_kendaraan')
            await thisData.save()
            return response.json(thisData)
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ response, params }) {
        try {
            const thisData = await MerkKendaraan.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Data berhasil dihapus' })
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async getAll({ response }){
        return response.json(await MerkKendaraan.query().orderBy('merk_kendaraan', 'asc').fetch()) 
    }

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/merk-kendaraan/${params.file}`))
    }

}

module.exports = MerkKendaraanController
