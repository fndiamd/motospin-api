'use strict'

const Firebase = use('Adonis/Services/Firebase')
const Token = use('App/Models/FirebaseTokenUser')
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

Notification.createdOrderProduk = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    let data = {}
    if (order.order_delivery) {
        data = {
            title: 'Checkout Sparepart Berhasil',
            body: `Segera selesaikan pembayaran agar sparepart segera diproses oleh bengkel`
        }
    } else {
        data = {
            title: 'Checkout Sparepart Berhasil',
            body: `Anda bisa mengambil sparepart setelah bengkel sudah siap`
        }
    }

    const message = {
        notification: {
            title: `${data.title}`,
            body: `${data.body}`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: `${data.title}`,
                body: `${data.body}`,
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

Notification.requestPaymentProduk = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const data = {
        title: 'Checkout Sparepart Berhasil',
        body: `Segera selesaikan pembayaran agar sparepart segera diproses oleh bengkel`
    }

    const message = {
        notification: {
            title: `${data.title}`,
            body: `${data.body}`
        },
        data: {
            notification_type: 'order-produk',
            id_order_produk: `${order.id_order_produk}`
        },
        android: {
            priority: 'high',
            notification: {
                title: `${data.title}`,
                body: `${data.body}`,
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
