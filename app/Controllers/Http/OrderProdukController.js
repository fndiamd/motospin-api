'use strict'

const { auth } = require("firebase-admin")

const Order = use('App/Models/OrderProduk')
const DetailOrder = use('App/Models/DetailOrderProduk')
const Ekspedisi = use('App/Models/PengirimanProduk')

const moment = use('moment')

class OrderProdukController {

    async userOrder({ request, response, auth }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('user').getUser()
            const result = await Order
                .query()
                .with('outlet')
                .with('detailOrder.produk')
                .with('payment')
                .with('ekspedisi')
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
            const req = request.all()

            const date = new Date().toJSON().slice(0, 10).replace(/-/g, '')
            const kode = Math.random().toString(36).substring(7).toUpperCase()

            const order = await Order.create({
                order_tanggal: moment().format('Y-MM-DD HH:mm:ss Z'),
                order_kode: `MSPIN${date}SPR${req.id_mitra}${kode}`,
                nama_penerima: req.nama_penerima,
                alamat_penerima: req.alamat_penerima.alamat,
                order_delivery: req.order_delivery,
                id_user: authData.id_user,
                id_mitra: req.id_mitra
            })

            const orderProduk = []
            req.produkCart.map(item => {
                orderProduk.push({
                    id_order_produk: 1,
                    id_produk: item.id_produk,
                    jumlah: item.jumlah,
                    harga_satuan: item.produk.produk_harga,
                    id_order_produk: order.id_order_produk
                })
            })

            const detailOrder = await DetailOrder.createMany(orderProduk)
            const ekspedisi = await Ekspedisi.create({
                courier: req.ekspedisi.courier,
                courier_service: req.ekspedisi.courier_service,
                courier_cost: req.ekspedisi.courier_cost,
                courier_etd: req.ekspedisi.courier_etd,
                id_order_produk: order.id_order_produk
            })
            return response.json({
                order: order,
                detail: detailOrder,
                ekspedisi: ekspedisi
            })
        } catch (error) {
            return error.message
        }
    }

    async delete({ auth, request, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const checkData = await Order.query()
                .where({ id_user: authData.id_user, id_order_produk: params.id }).first()
            if (!checkData)
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            
            const thisData = await Order.find(params.id)
            await thisData.delete()
            return response.json({ message: 'Order berhasil dihapus' })
        } catch (error) {
            return response.status(error).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = OrderProdukController
