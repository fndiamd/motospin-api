'use strict'

const Produk = use('App/Models/Produk')
const Kendaraan = use('App/Models/KendaraanUser')
const GambarProduk = use('App/Models/GambarProduk')
const KompatibelProduk = use('App/Models/KompatibelProduk')

const ImportService = use('App/Services/ImportProductServices')

const Helpers = use('Helpers')
const Env = use('Env')
const fs = require('fs')
const path = require('path')

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
                .with('kategori')
                .with('merk')
                .with('kompatibelProduk')
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

    async update({ auth, request, response, params }) {
        try {
            // const dataUpdate = {
            //     produk_nama: request.input('produk_nama'),
            //     produk_stok: request.input('produk_stok'),
            //     produk_harga: request.input('produk_harga'),
            //     produk_berat: request.input('produk_berat')
            // }

            // const updating = await Produk.query()
            //     .where({
            //         id_produk: params.id,
            //         id_mitra: request.input('id_mitra')
            //     }).update(dataUpdate)
            // if (updating) {
            //     return await Produk.find(params.id)
            // } else {
            //     return response.status(404).send({ message: 'Data tidak ditemukan' })
            // }
            return await this.updateProductPicture()

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

    async searchName({ request, response }) {
        try {
            const keywords = request.input('produk_nama').toLowerCase()
            const result = await Produk
                .query()
                .whereRaw(`LOWER(produk_nama) LIKE '%${keywords}%'`)
                .fetch()
            if (result.rows.length == 0) {
                return response.status(404).send({ message: `Pencarian untuk ${keywords} tidak ditemukan` })
            }

            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async filterProduk({ request, response }) {
        const pagination = request.only(['page', 'limit', 'column', 'sort'])
        const filter = request.only(['kategori', 'merk'])
        const keyword = request.input('keyword')

        let page = pagination.page || 1
        let limit = pagination.limit || 5
        let column = pagination.column || 'created_at'
        let sort = pagination.sort || 'desc'

        let queryRaw

        if (filter.kategori != null) {
            if (queryRaw != undefined)
                queryRaw += ' AND '
            queryRaw += `WHERE id_kategori_produk = '${filter.kategori}'`
        }


        if (filter.merk != null) {
            if (queryRaw != undefined)
                queryRaw += ' AND '
            queryRaw += `id_merk_produk = '${filter.merk}'`
        }


        if (keyword != null) {
            if (queryRaw != undefined)
                queryRaw += ' AND '
            queryRaw += `LOWER(produk_nama) LIKE '%${keyword.toLowerCase()}%'`
        }

        queryRaw = queryRaw.replace('undefined', '')
        const query = queryRaw.split(' ').slice(1).join(' ')
        const result = await Produk
            .query()
            .with('outlet')
            .with('gambar')
            .with('kategori')
            .with('merk')
            .with('kompatibelProduk')
            .whereRaw(query)
            .fetch()

        return response.json(result)
    }

    async produkOutlet({ request, response }) {
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
        const kendaraanUser = await Kendaraan.query().where({ id_user: authData.id_user, kendaraan_utama: true }).first()
        const kompatibelProduk = await KompatibelProduk.query().where({ id_tipe_kendaraan: kendaraanUser.id_tipe_kendaraan }).fetch()
        const id_produk = []
        kompatibelProduk.toJSON().map(e => {
            id_produk.push(e.id_produk)
        })
        const produk = await Produk
            .query()
            .with('outlet')
            .with('gambar')
            .with('kategori')
            .with('merk')
            .with('kompatibelProduk')
            .whereIn('id_produk', id_produk).fetch()
        return produk
    }

    async storeProduct({ request, response }) {
        try {
            const data = {
                produk_nama: request.input('produk_nama'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat'),
                produk_deskripsi: request.input('produk_deskripsi'),
                id_mitra: request.input('id_mitra'),
                id_kategori_produk: request.input('id_kategori_produk'),
                id_merk_produk: request.input('id_merk_produk')
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
                    name: `${id_produk}${new Date().getTime()}.${file.subtype}`
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
                return { error: error.name, msg: error.message }
            }

        } catch (error) {
            return response.status(error.status).send({
                sector: 'Kompatibel Produk',
                error: error.name,
                message: error.message
            })
        }
    }

    async updateProduct({ request, response, params }) {
        try {
            const thisData = await Produk.findOrFail(params.id)
            const data = {
                produk_nama: request.input('produk_nama'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat'),
                produk_deskripsi: request.input('produk_deskripsi'),
                id_mitra: request.input('id_mitra'),
                id_kategori_produk: request.input('id_kategori_produk'),
                id_merk_produk: request.input('id_merk_produk')
            }

            thisData.produk_nama = data.produk_nama
            thisData.produk_stok = data.produk_stok
            thisData.produk_harga = data.produk_harga
            thisData.produk_berat = data.produk_berat
            thisData.produk_deskripsi = data.produk_deskripsi
            thisData.id_mitra = data.id_mitra
            thisData.id_kategori_produk = data.id_kategori_produk
            thisData.id_merk_produk = data.id_merk_produk
            await thisData.save()

            return thisData
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                sector: 'Produk',
                error: error.name,
                message: error.message
            })
        }
    }

    async updateProductPicture({ request, response }, id_produk) {
        try {
            const imgProduct = request.file('img_produk', {
                types: ['image', 'jpg', 'png', 'jpeg'],
                size: '2mb'
            })

            await imgProduct.moveAll(Helpers.publicPath('uploads/produk'), (file) => {
                return {
                    name: `${id_produk}${new Date().getTime()}.${file.subtype}`
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

            // const gambarProduk = await GambarProduk.createMany(gambars)
            // return gambarProduk
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Gambar Produk',
                error: error.name,
                message: error.message
            })
        }
    }

    async updateCompatibleProduct() {
    }

    async importProduk({ request, response, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()
            let file = request.file('excel_file')
            let fname = `${new Date().getTime()}.${file.extname}`
            let dir = 'upload/'

            //move uploaded file into custom folder
            await file.move(Helpers.tmpPath(dir), {
                name: fname
            })

            if (!file.moved()) {
                console.log('error')
                return (file.error(), 'Error moving files', 500)
            }

            let send = await ImportService.ImportClassification(outlet.id_mitra, 'tmp/' + dir + fname)

            const removeFile = Helpers.promisify(fs.unlink)
            if(send){
                removeFile(path.join(file._location, fname))
                return response.ok({ message: 'Import produk berhasil' })
            }
            

        } catch (error) {
            return error.message
        }
    }


}

module.exports = ProdukController
