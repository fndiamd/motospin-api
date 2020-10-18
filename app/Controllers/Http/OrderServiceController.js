'use strict'

const OrderService = use('App/Models/OrderService')
const DetailOrder = use('App/Models/DetailOrderService')
const MitraOutlet = use('App/Models/MitraOutlet')
const Event = use('Event')

class OrderServiceController {

    // User Order

    async serviceUser({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('user').getUser()
            const result = await OrderService
                .query()
                .with('outlet')
                .with('merkKendaraan')
                .with('tipeKendaraan')
                .with('detailOrder.tipeService')
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

    async userOrderHistory({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('user').getUser()
            const result = await OrderService
                .query()
                .with('outlet')
                .with('merkKendaraan')
                .with('tipeKendaraan')
                .with('detailOrder.tipeService')
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

    async viewOrderUser({ auth, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await OrderService
                .query()
                .with('outlet')
                .with('merkKendaraan')
                .with('tipeKendaraan')
                .with('detailOrder.tipeService')
                .where({ id_user: authData.id_user, id_order_service: params.id })
                .first()

            return response.json(thisData)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response, auth }) {
        try {
            const order = await this.createOrder({ request, response, auth })
            const detailOrder = await this.createDetailOrder({ request, response }, order.id_order_service)
            Event.fire('new::orderService', order)
            Event.fire('notifOutlet::orderService', order)

            return response.json({
                order: order,
                detailOrder: detailOrder
            })
        } catch (error) {
            return error.message
        }
    }

    async createOrder({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const date = new Date().toJSON().slice(0, 10).replace(/-/g, '')
            const kode = Math.random().toString(36).substring(7).toUpperCase()
            const dataOrder = {
                order_tanggal: request.input('order_tanggal'),
                order_kode: `MSPIN${date}SVC${request.input('id_mitra')}${kode}`,
                kendaraan_nopol: request.input('kendaraan_nopol'),
                kendaraan_tahun: request.input('kendaraan_tahun'),
                kendaraan_no_rangka: request.input('kendaraan_no_rangka'),
                id_merk_kendaraan: request.input('id_merk_kendaraan'),
                id_tipe_kendaraan: request.input('id_tipe_kendaraan'),
                id_user: authData.id_user,
                id_mitra: request.input('id_mitra')
            }

            const order = await OrderService.create(dataOrder)
            return order
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Create Order',
                error: error.name,
                message: error.message
            })
        }
    }

    async createDetailOrder({ request, response }, id_order) {
        try {

            const data = request.all()
            const storeData = []
            try {
                data['detail_order'].map(e => {
                    storeData.push({
                        id_tipe_service: e.id_tipe_service,
                        id_order_service: id_order,
                        detail_catatan_user: e.detail_catatan_user
                    })
                })

                return await DetailOrder.createMany(storeData)
            } catch (error) {
                return error.message
            }
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Create Detail Order',
                error: error.name,
                message: error.message
            })
        }
    }

    async cancelOrder({ response, params, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await OrderService.query()
                .where({
                    id_mitra: outlet.id_mitra,
                    id_order_service: params.id,
                    order_status: 0
                })
                .update({
                    order_status: -1
                })
            if (!orderData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            const order = await OrderService.query()
                .where({
                    id_order_service: params.id,
                }).with('outlet').first()
            Event.fire('cancel::orderService', { order, outlet })
            return response.json({ message: 'Order declined' })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    // Outlet Order
    async serviceOutlet({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()

            const result = await OrderService
                .query()
                .with('user')
                .with('merkKendaraan')
                .with('tipeKendaraan')
                .with('detailOrder.tipeService')
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

    async outletOrderHistory({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            const page = pagination.page || 1
            const limit = pagination.limit || 5
            const column = pagination.column || 'created_at'
            const sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().fetch()
            const result = await OrderService
                .query()
                .with('user')
                .with('merkKendaraan')
                .with('tipeKendaraan')
                .with('detailOrder.tipeService')
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

    async acceptOrder({ response, params, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await OrderService.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_service: params.id,
                order_status: 0
            })

            orderData.order_status = 1
            await orderData.save()

            const order = await OrderService.query()
                .where({
                    id_order_service: orderData.id_order_service,
                })
                .with('outlet')
                .first()

            Event.fire('accept::orderService', order)

            return response.json({ message: 'Order accepted' })
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

    async workingOrder({ response, params, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await OrderService.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_service: params.id,
                order_status: 1
            })

            orderData.order_status = 2
            await orderData.save()

            const order = await OrderService.query()
                .where({
                    id_order_service: orderData.id_order_service,
                })
                .with('outlet')
                .first()

            Event.fire('working::orderService', order)

            return response.json({ message: 'Order sedang dikerjakan' })
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

    async declineOrder({ response, params, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await OrderService.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_service: params.id,
                order_status: 0
            })

            orderData.order_status = -1
            await orderData.save()

            const order = await OrderService.query()
                .where({
                    id_order_service: params.id,
                })
                .with('outlet')
                .first()

            Event.fire('decline::orderService', order)

            return response.json({ message: 'Order declined' })
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

    async finishOrder({ response, params, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const outlet = await authData.outlet().first()

            const orderData = await OrderService.findByOrFail({
                id_mitra: outlet.id_mitra,
                id_order_service: params.id,
                order_status: 2
            })

            orderData.order_status = 3
            await orderData.save()

            const order = await OrderService.query()
                .where({
                    id_order_service: params.id,
                })
                .with('outlet')
                .with('detailOrder')
                .first()

            Event.fire('finish::orderService', order)

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

module.exports = OrderServiceController
