'use strict'

const OrderProduk = use('App/Models/OrderProduk')
const DetailOrderProduk = use('App/Models/DetailOrderProduk')
const Event = use('Event')

class OrderProdukController {

    async userOrder({ request, response, auth }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('user').getUser()
            const result = await OrderProduk
                .query()
                .with('outlet')
                .with('detailOrder.produk')
                .where({ id_user: authData.id_user, order_status: request.input('status') })
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)
            return response.json(result)
        } catch (error) {

        }
    }

    async store({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const produk = request.input('produkCart')

            let total = 0;
            produk.map(e => {
                total += e.produk.produk_harga * e.jumlah
            })
            
            const date = new Date().toJSON().slice(0, 10).replace(/-/g, '')
            const kode = Math.random().toString(36).substring(7).toUpperCase()

            const data = {
                order_tanggal: request.input('order_tanggal'),
                order_kode: `MSPIN/${date}/SPR/${request.input('id_mitra')}/${kode}`,
                nama_penerima: request.input('nama_penerima'),
                alamat_penerima: request.input('alamat_penerima'),
                order_total: total,
                order_status: 0,
                order_delivery: request.input('order_delivery'),
                id_user: authData.id_user,
                id_mitra: request.input('id_mitra')
            }

            const order = await OrderProduk.create(data)
            const dataDetail = []
            produk.map(e => {
                dataDetail.push({
                    id_order_produk: order.id_order_produk,
                    id_produk: e.id_produk,
                    jumlah: e.jumlah,
                    harga_satuan: e.produk.produk_harga
                })
            })

            Event.fire('new::orderProduk', order)

            const detailOrder = await DetailOrderProduk.createMany(dataDetail)
            return response.json({
                order: order,
                detailOrder: detailOrder
            })
        } catch (error) {
            return error.message
        }
    }



}

module.exports = OrderProdukController
