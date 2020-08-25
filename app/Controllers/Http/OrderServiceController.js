'use strict'

const OrderService = use('App/Models/OrderService')
const DetailOrder = use('App/Models/DetailOrderService')
const MitraOutlet = use('App/Models/MitraOutlet')
const Event = use('Event')

class OrderServiceController {

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
                order_kode: `MSPIN/${date}/SVC/${request.input('id_mitra')}/${kode}`,
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

    async acceptOrder({ response, params, auth, request }) {
        try {
            let id_mitra;
            if(auth.user.id_pegawai){
                const authData = await auth.authenticator('pegawai').getUser()
                id_mitra = authData.id_mitra
            }else if(auth.user.id_owner){
                id_mitra = request.input('id_mitra')
            }else{
                return response.status(401).json()
            }
            
            const orderData = await OrderService.query()
                .where({
                    id_mitra: id_mitra,
                    id_order_service: params.id,
                    order_status: 0
                })
                .update({
                    order_status: 1
                })
            if (!orderData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }

            const order = await OrderService.query()
                .where({
                    id_order_service: params.id,
                }).with('outlet').first()
            Event.fire('accept::orderService', order)
            return response.json({ message: 'Order accepted'})
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async declineOrder({ response, params, auth }) {
        try {
            let id_mitra;
            if(auth.user.id_pegawai){
                const authData = await auth.authenticator('pegawai').getUser()
                id_mitra = authData.id_mitra
            }else if(auth.user.id_owner){
                id_mitra = request.input('id_mitra')
            }else{
                return response.status(401).json()
            }
            const orderData = await OrderService.query()
                .where({
                    id_mitra: id_mitra,
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
            Event.fire('decline::orderService', order)
            return response.json({ message: 'Order declined' })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async finishOrder({ response, params, auth }) {
        try {
            let id_mitra;
            if(auth.user.id_pegawai){
                const authData = await auth.authenticator('pegawai').getUser()
                id_mitra = authData.id_mitra
            }else if(auth.user.id_owner){
                id_mitra = request.input('id_mitra')
            }else{
                return response.status(401).json()
            }
            const orderData = await OrderService.query()
                .where({
                    id_mitra: id_mitra,
                    id_order_service: params.id,
                    order_status: 1
                })
                .update({
                    order_status: 2
                })
            if (!orderData) {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
            const order = await OrderService.query()
                .where({
                    id_order_service: params.id,
                }).with('outlet').first()
            Event.fire('finish::orderService', order)
            return response.json({ message: 'Order finished' })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = OrderServiceController
