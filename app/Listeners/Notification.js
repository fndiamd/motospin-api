'use strict'

const Firebase = use('Adonis/Services/Firebase')
const Token = use('App/Models/FirebaseTokenUser')
const Outlet = use('App/Models/MitraOutlet')
const Dompet = use('App/Models/DompetOwner')
const HistoriDompet = use('App/Models/HistoriDompetOwner')

const Notification = exports = module.exports = {}

Notification.createdOrderService = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan berhasil dibuat',
            body: `Pemesanan Service Bengkel dengan invoice ${order.order_kode} berhasil dibuat`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan berhasil dibuat',
                body: `Pemesanan Service Bengkel dengan invoice ${order.order_kode} berhasil dibuat`,
                sound: 'default',
                priority: 'high',
                channelId: '500'
            }
        },
        tokens: registrationToken
    }

    try {
        Firebase.messaging().sendMulticast(message)
    } catch (error) {
        return error.message
    }
}

Notification.acceptOrderService = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan diterima bengkel',
            body: `Pesanan dengan invoice ${order.order_kode} diterima ${order.toJSON().outlet.mitra_nama}`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan diterima bengkel',
                body: `Pesanan dengan invoice ${order.order_kode} diterima ${order.toJSON().outlet.mitra_nama}`,
                sound: 'default',
                priority: 'high',
                channelId: '500'
            }
        },
        tokens: registrationToken
    }

    try {
        Firebase.messaging().sendMulticast(message)
    } catch (error) {
        return error.message
    }
}

Notification.declineOrderService = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan anda dibatalkan',
            body: `Pesanan dengan invoice ${order.order_kode} dibatalkan oleh ${order.toJSON().outlet.mitra_nama}`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan diterima bengkel',
                body: `Pesanan dengan invoice ${order.order_kode} diterima bengkel ${order.toJSON().outlet.mitra_nama}`,
                sound: 'default',
                priority: 'high',
                channelId: '500'
            }
        },
        tokens: registrationToken
    }

    try {
        Firebase.messaging().sendMulticast(message)
    } catch (error) {
        return error.message
    }
}

Notification.finishOrderService = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const outlet = await Outlet.findBy('id_mitra', order.id_mitra)
    const total = order.toJSON().detailOrder.reduce((a, b) => +a + +b.detail_order_harga, 0)

    let cost = Math.ceil(total * 0.01)
    if (cost > 5000)
        cost = 5000

    const dompet = await Dompet.findBy({ 'id_owner': outlet.id_owner, 'tipe_saldo': 'kredit' })
    dompet.saldo -= cost
    await dompet.save()

    await HistoriDompet.create({
        id_dompet: dompet.id_dompet,
        kode_transaksi: order.order_kode,
        nominal_transaksi: -cost,
        status_transaksi: 2
    })

    const message = {
        notification: {
            title: 'Pesanan telah selesai',
            body: `Pesanan dengan invoice ${order.order_kode} telah diselesaikan ${order.toJSON().outlet.mitra_nama}`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan telah selesai',
                body: `Pesanan dengan invoice ${order.order_kode} telah diselesaikan ${order.toJSON().outlet.mitra_nama}`,
                sound: 'default',
                priority: 'high',
                channelId: '500'
            }
        },
        tokens: registrationToken
    }

    try {
        Firebase.messaging().sendMulticast(message)
    } catch (error) {
        return error.message
    }
}