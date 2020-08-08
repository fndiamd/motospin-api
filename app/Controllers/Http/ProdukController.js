'use strict'

const Produk = use('App/Models/Produk')

class ProdukController {

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const result = await Produk.query()
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
            const data = {
                produk_nama: request.input('produk_nama'),
                produk_merk_kendaraan: request.input('produk_merk_kendaraan'),
                produk_tipe_kendaraan: request.input('produk_tipe_kendaraan'),
                produk_tahun_kendaraan: request.input('produk_tahun_kendaraan'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat'),
                id_merk_produk: request.input('id_merk_produk'),
                id_kategori_produk: request.input('id_kategori_produk'),
                id_mitra: request.input('id_mitra')
            }

            try {
                const exec = await Produk.create(data)
                return response.json(exec)
            } catch (error) {
                return error.message
            }
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
            const dataUpdate = {
                produk_nama: request.input('produk_nama'),
                produk_merk_kendaraan: request.input('merk_kendaraan'),
                produk_tipe_kendaraan: request.input('tipe_kendaraan'),
                produk_tahun_kendaraan: request.input('tahun_kendaraan'),
                produk_stok: request.input('produk_stok'),
                produk_harga: request.input('produk_harga'),
                produk_berat: request.input('produk_berat'),
                id_merk_produk: request.input('id_merk_produk'),
                id_kategori_produk: request.input('id_kategori_produk'),
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

}

module.exports = ProdukController
