'use strict'

const { auth } = require("firebase-admin")

const Order = use('App/Models/OrderProduk')
const DetailOrder = use('App/Models/DetailOrderProduk')
const Ekspedisi = use('App/Models/PengirimanProduk')
const Cart = use('App/Models/KeranjangProduk')

const moment = use('moment')
const Event = use('Event')

class OrderProdukController {

    // User Order

    async userOrder({ auth, response, request }) {
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

    async store({ auth, response, request }) {
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
                if (item.id_keranjang_produk)
                    idKeranjang.push(item.id_keranjang_produk)
                orderProduk.push({
                    id_produk: item.id_produk,
                    jumlah: item.jumlah,
                    harga_satuan: item.produk.produk_harga,
                    id_order_produk: order.id_order_produk
                })
            })

            if (idKeranjang.length > 0)
                await Cart.query().whereIn('id_keranjang_produk', idKeranjang).delete()
            const detailOrder = await DetailOrder.createMany(orderProduk)

            if(req.order_delivery == true){
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
            }

            Event.fire('notifOutletCOD::orderProduk', order)
            
            return response.json({
                order: order,
                detail: detailOrder
            })
            
        } catch (error) {
            return error.message
        }
    }

    async userCancelOrder({ auth, params, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Order.findByOrFail({
                id_user: authData.id_user,
                id_order_produk: params.id,
                order_status: 0
            })

            thisData.order_status = -1
            thisData.order_cancel_description = request.input('order_cancel_description')
            await thisData.save()

            Event.fire('userCancel::orderProduk', thisData)

            return response.ok({ message: 'Order berhasil dibatalkan' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async userOrderHistory({ auth, response, request }) {
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
                .where({ id_user: authData.id_user })
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

    async userFinishOrder({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()

            const orderData = await Order.findByOrFail({
                id_user: authData.id_user,
                order_kode: request.input('order_kode'),
            })

            const order = await Order.query()
                .where({
                    id_order_produk: orderData.id_order_produk,
                })
                .with('outlet')
                .with('detailOrder')
                .first()

            Event.fire('finish::orderProduk', order)
            return response.json({ message: 'Order finished' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    // Outlet Order

    async outletOrder({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()

            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const result = await Order
                .query()
                .with('user')
                .with('detailOrder.produk')
                .with('payment')
                .with('ekspedisi')
                .where({ id_mitra: outlet.id_mitra, order_status: request.input('status') })
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

    async outletCancelOrder({ auth, params, response, request }) {
        try {

            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()

            const thisData = await Order.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_produk: params.id,
                order_status: 0
            })

            thisData.order_status = -2
            thisData.order_cancel_description = request.input('order_cancel_description')
            await thisData.save()

            Event.fire('outletCancel::orderProduk', thisData)

            return response.ok({ message: 'Order berhasil dibatalkan' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async outletOrderHistory({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()

            const result = await Order
                .query()
                .with('user')
                .with('detailOrder.produk')
                .with('payment')
                .with('ekspedisi')
                .where({ id_mitra: outlet.id_mitra })
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

    async acceptOrder({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const thisData = await Order.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_produk: params.id,
                order_status: 2
            })

            const order = await Order.query()
                .where({
                    id_order_produk: thisData.id_order_produk,
                }).with('outlet').first()

            Event.fire('accept::orderProduk', order)

            return response.ok({ message: 'Order accepted' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async sendingOrder({ auth, params, response, request }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const thisData = await Order.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_produk: params.id,
                order_status: 3
            })

            const ekspedisi = await Ekspedisi.findByOrFail('id_order_produk', params.id)
            ekspedisi.nomor_resi = request.input('nomor_resi')
            await ekspedisi.save()

            const order = await Order.query()
                .where({
                    id_order_produk: thisData.id_order_produk,
                }).with('outlet').first()

            Event.fire('sending::orderProduk', {order, ekspedisi})
            return response.json({ message: 'Pesanan dikirim' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async outletFinishOrder({ auth, response, request }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await Order.findByOrFail({
                id_mitra: outlet.id_mitra,
                order_kode: request.input('order_kode'),
            })

            if (orderData.order_delivery == true && orderData.order_status < 2) {
                return response.status(400).send({
                    message: 'Produk perlu dikemas'
                })
            }

            const order = await Order.query()
                .where({
                    id_order_produk: orderData.id_order_produk,
                })
                .with('outlet')
                .with('detailOrder')
                .first()

            Event.fire('finish::orderProduk', order)
            return response.json({ message: 'Order finished' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

}

module.exports = OrderProdukController
