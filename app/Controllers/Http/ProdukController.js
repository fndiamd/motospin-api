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

    async store({ request, params }) { 
        
    }

    async update() { }

    async delete() { }

    async search() { }

    async ownProduk() { }

}

module.exports = ProdukController
