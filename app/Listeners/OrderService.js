'use strict'

const Firebase = use('Adonis/Services/Firebase')
const Token = use('App/Models/FirebaseTokenUser')
const OrderService = exports = module.exports = {}

OrderService.created = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan berhasil dibuat',
            body: `Pesanan dengan invoice ${order.order_kode} berhasil dibuat`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan berhasil dibuat',
                body: `Pesanan dengan invoice ${order.order_kode} berhasil dibuat`,
                sound: 'default',
                priority: 'high',
                channelId: '500'
            }
        },
        tokens: registrationToken
    }

    try {
        Firebase.messaging().sendMulticast(message)
        return response.send('berhasil')
    } catch (error) {
        return error.message
    }
}

OrderService.accept = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    console.log(order.id_user);

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
        return response.send('berhasil')
    } catch (error) {
        return error.message
    }
}

OrderService.decline = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    console.log(order.id_user);

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
        return response.send('berhasil')
    } catch (error) {
        return error.message
    }
}

OrderService.finish = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    console.log(order.id_user);

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
        return response.send('berhasil')
    } catch (error) {
        return error.message
    }
}
