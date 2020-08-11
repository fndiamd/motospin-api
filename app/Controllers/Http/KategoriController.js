'use strict'

const Kategori = use('App/Models/KategoriProduk')
const Helpers = use('Helpers')
const Env = use('Env')

class KategoriController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'
            const result = await Kategori
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
            const thisData = await Kategori.findOrFail(params.id)
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
        const logoFile = request.file('logo_file', {
            types: ['png'],
            size: '1mb'
        })

        let nameLogo = request.input('kategori_produk') + '.png'

        const data = {
            kategori_produk: request.input('kategori_produk'),
            kategori_status: 1,
            kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/${nameLogo}`
        }

        const checkExists = await Kategori.findBy('kategori_produk', data.kategori_produk)
        if (checkExists) {
            return response.status(404).send({ message: 'Kategori sudah ada!' })
        }

        try {
            await logoFile.move(Helpers.publicPath('uploads/kategori'), {
                name: nameLogo,
                overwrite: true
            })

            if (!logoFile.moved()) {
                return logoFile.error()
            }

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
        try {
            const logoFile = request.file('logo_file', {
                types: ['png'],
                size: '1mb'
            })
            let nameLogo = request.input('kategori_produk') + '.png'

            const dataUpdate = {
                kategori_produk: request.input('kategori_produk'),
                kategori_status: request.input('kategori_status')
            }

            const thisData = await Kategori.findOrFail(params.id)
            const checkExists = await Kategori.findBy('kategori_produk', request.input('kategori_produk'))

            if (checkExists && thisData.kategori_produk != request.input('kategori_produk')) {
                return response.status(400).send({ message: 'Kategori sudah ada!' })
            }

            if (request.file('logo_file') != null) {
                await logoFile.move(Helpers.publicPath('uploads/kategori'), {
                    name: nameLogo,
                    overwrite: true
                })

                if (!logoFile.moved()) {
                    return logoFile.error()
                }

                thisData.kategori_img_path = `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/${nameLogo}`
            }

            thisData.kategori_produk = dataUpdate.kategori_produk
            thisData.kategori_status = dataUpdate.kategori_status
            await thisData.save()

            return response.json(thisData)
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

    async delete({ request, response, params }) {
        try {
            const thisData = await Kategori.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: 'Kategori berhasil dihapus' })
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

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/kategori/${params.file}`))
    }

}

module.exports = KategoriController
