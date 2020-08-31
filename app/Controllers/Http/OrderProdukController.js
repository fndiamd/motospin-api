'use strict'

const { auth } = require("firebase-admin")

const Order = use('App/Models/OrderProduk')
const DetailOrder = use('App/Models/DetailOrderProduk')
const Ekspedisi = use('App/Models/PengirimanProduk')
const Cart = use('App/Models/KeranjangProduk')

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
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async outletOrder({ request, response }){
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const result = await Order
                .query()
                .with('outlet')
                .with('detailOrder.produk')
                .with('payment')
                .with('ekspedisi')
                .where({ id_mitra: request.input('id_mitra'), order_status: request.input('status') })
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
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
            const idKeranjang = []
            req.produkCart.map(item => {
                if(item.id_keranjang_produk)
                    idKeranjang.push(item.id_keranjang_produk)
                orderProduk.push({
                    id_produk: item.id_produk,
                    jumlah: item.jumlah,
                    harga_satuan: item.produk.produk_harga,
                    id_order_produk: order.id_order_produk
                })
            })

            if(!idKeranjang)
                await Cart.query().whereIn('id_keranjang_produk', idKeranjang).delete()
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

    async userCancelOrder({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const checkOrder = await Order.query().where({
                id_user: authData.id_user,
                id_order_produk: request.input('id_order_produk'),
                order_status: 0
            }).first()
            if (!checkOrder)
                return response.status(404).send({ message: 'Order tidak ditemukan' })

            await Order.query().where({
                id_user: authData.id_user,
                id_order_produk: request.input('id_order_produk')
            }).update({
                order_status: -1,
                order_cancel_description: request.input('order_cancel_description')
            })
            return response.json({ message: 'Order berhasil dibatalkan' })
        } catch (error) {
            return response.status(error).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async outletCancelOrder({ request, response }) {
        try {
            const checkOrder = await Order.query().where({
                id_mitra: request.input('id_mitra'),
                id_order_produk: request.input('id_order_produk'),
                order_status: 0
            }).first()
            if (!checkOrder)
                return response.status(404).send({ message: 'Order tidak ditemukan' })

            await Order.query().where({
                id_mitra: request.input('id_mitra'),
                id_order_produk: request.input('id_order_produk')
            }).update({
                order_status: -2,
                order_cancel_description: request.input('order_cancel_description')
            })
            return response.json({ message: 'Order berhasil dibatalkan' })
        } catch (error) {
            return response.status(error).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = OrderProdukController
