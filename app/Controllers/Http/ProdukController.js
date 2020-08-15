'use strict'

const Produk = use('App/Models/Produk')
const Kendaraan = use('App/Models/Kendaraan')
const GambarProduk = use('App/Models/GambarProduk')
const KompatibelProduk = use('App/Models/KompatibelProduk')

const Helpers = use('Helpers')
const Env = use('Env')

class ProdukController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const result = await Produk.query()
                .with('outlet')
                .with('gambar')
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
            const thisData = await Produk.query()
                .with('kategori')
                .with('merk')
                .with('outlet')
                .where({ id_produk: params.id })
                .first()

            if (!thisData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            return response.json(thisData)

        } catch (error) {
            return response.satus(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response }) {
        try {
            const produk = await this.storeProduct({ request, response })
            const id_produk = produk.id_produk
            const gambarProduk = await this.storeProductPicture({ request, response }, id_produk)
            const kompatibelProduk = await this.storeCompatibleProduct({ request, response }, id_produk)
            return { produk, gambarProduk, kompatibelProduk }
        } catch (error) {
            return error.message
        }
    }

    async update({ request, response, params }) {
        try {
            const dataUpdate = {
                produk_nama: request.input('produk_nama'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat')
            }

            const updating = await Produk.query()
                .where({
                    id_produk: params.id,
                    id_mitra: request.input('id_mitra')
                }).update(dataUpdate)
            if (updating) {
                return await Produk.find(params.id)
            } else {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

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
            const thisData = await Produk
                .query()
                .where({ id_produk: params.id, id_mitra: request.input('id_mitra') }).first()

            if (!thisData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            const produk = await Produk.find(params.id)
            await produk.delete()
            return response.json({ message: 'success' })
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }

    }

    async search(request, response) {
        const keywords = request.only(['id_merk', 'id_kategori', 'produk_nama'])
    }

    async ownProduk({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const result = await Produk.query()
                .where({ id_mitra: request.input('id_mitra') })
                .with('kategori')
                .with('merk')
                .with('outlet')
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

    async recommendProduct({ auth }) {
        const authData = await auth.authenticator('user').getUser()
        const kendaraanUser = await Kendaraan.query().where({ id_user: authData.id_user }).fetch()
        const dataMerk = []
        const dataTipe = []
        kendaraanUser.toJSON().map(element => {
            dataMerk.push(element.kendaraan_merk)
            dataTipe.push(element.kendaraan_tipe)
        })

        const recommended = await Produk.query().whereIn('`produk_tipe_kendaraan`', dataTipe).fetch()
        return recommended
    }

    async storeProduct({ request, response }) {
        try {
            const data = {
                produk_nama: request.input('produk_nama'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat'),
                id_mitra: request.input('id_mitra')
            }

            const produk = await Produk.create(data)
            return produk
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Produk',
                error: error.name,
                message: error.message
            })
        }
    }

    async storeProductPicture({ request, response }, id_produk) {
        try {
            const imgProduct = request.file('img_produk', {
                types: ['image', 'jpg', 'png', 'jpeg'],
                size: '2mb'
            })

            await imgProduct.moveAll(Helpers.publicPath('uploads/produk'), (file) => {
                return {
                    name: `${id_produk}-${file.clientName}`
                }
            })

            const fs = Helpers.promisify(require('fs'))
            const removeFile = Helpers.promisify(fs.unlink)
            const movedFiles = imgProduct.movedList()

            if (!imgProduct.movedAll()) {

                await Promise.all(movedFiles.map((file) => {
                    return removeFile(path.join(file._location, file.fileName))
                }))

                return imgProduct.errors()
            }

            const gambars = []

            await Promise.all(movedFiles.map((file) => {
                gambars.push({
                    id_produk: id_produk,
                    gambar_url_path: `${Env.get('APP_URL')}/api/v1/gambar-produk/img-url/${id_produk}/${file.fileName}`
                })
            }))

            const gambarProduk = await GambarProduk.createMany(gambars)
            return gambarProduk
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Gambar Produk',
                error: error.name,
                message: error.message
            })
        }
    }

    async storeCompatibleProduct({ request, response }, id_produk) {
        try {
            const data = request.collect(['id_tipe_kendaraan', 'kompatibel_tahun_kendaraan', 'kompatibel_nomor_rangka'])
            const storeData = []
            data.map(e => {
                storeData.push({
                    id_tipe_kendaraan: e.id_tipe_kendaraan,
                    kompatibel_tahun_kendaraan: e.kompatibel_tahun_kendaraan,
                    kompatibel_nomor_rangka: JSON.stringify(e.kompatibel_nomor_rangka),
                    id_produk: id_produk
                })
            })

            try {
                const r = await KompatibelProduk.createMany(storeData)
                return r
            } catch (error) {
                return {error: error.name, msg: error.message}
            }
            
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Kompatibel Produk',
                error: error.name,
                message: error.message
            })
        }
    }


}

module.exports = ProdukController
