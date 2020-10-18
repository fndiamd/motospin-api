'use strict'

const Firebase = require('firebase-admin')
const Token = use('App/Models/FirebaseTokenUser')
const TokenOwner = use('App/Models/FirebaseTokenOwner')
const Outlet = use('App/Models/MitraOutlet')
const Dompet = use('App/Models/DompetOwner')
const HistoriDompet = use('App/Models/HistoriDompetOwner')

const Order = use('App/Models/OrderProduk')

const OrderProduk = exports = module.exports = {}

OrderProduk.incomingOrderProduk = async (reqData) => {
    const order = await Order.findBy('order_kode', reqData.order_id)
    const outlet = await Outlet.findOrFail(order.id_mitra)

    const getToken = await TokenOwner.query().where({ id_owner: outlet.id_owner }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan sparepart baru',
            body: `Ada pesanan sparepart baru nih dengan invoice ${order.order_kode} segera dikonfirmasi yaa!`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan sparepart baru',
                body: `Ada pesanan sparepart baru nih dengan invoice ${order.order_kode} segera dikonfirmasi yaa!`,
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

OrderProduk.incomingOrderProdukCOD = async (order) => {
    const outlet = await Outlet.findOrFail(order.id_mitra)

    const getToken = await TokenOwner.query().where({ id_owner: outlet.id_owner }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan sparepart baru',
            body: `Ada pesanan sparepart baru nih dengan invoice ${order.order_kode} segera dikonfirmasi yaa!`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan sparepart baru',
                body: `Ada pesanan sparepart baru nih dengan invoice ${order.order_kode} segera dikonfirmasi yaa!`,
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

OrderProduk.acceptOrderProduk = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const thisOrder = await Order.findByOrFail('id_order_produk', order.id_order_produk)
    thisOrder.order_status = 3
    await thisOrder.save()

    const message = {
        notification: {
            title: 'Pesananmu sedang dikemas',
            body: `Pesanan dengan invoice ${order.order_kode} sedang dikemas ${order.toJSON().outlet.mitra_nama}`
        },
        data: {
            notification_type: 'order-produk',
            id_order: `${order.id_order_produk}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesananmu sedang dikemas',
                body: `Pesanan dengan invoice ${order.order_kode} sedang dikemas ${order.toJSON().outlet.mitra_nama}`,
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
        console.error(error.message)
    }
}

OrderProduk.sendingOrderProduk = async (data) => {
    const getToken = await Token.query().where({ id_user: data.order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const thisOrder = await Order.findByOrFail('id_order_produk', data.order.id_order_produk)
    thisOrder.order_status = 4
    await thisOrder.save()

    const message = {
        notification: {
            title: 'Pesananmu telah dikirim',
            body: `Pesananmu telah dikirim oleh penjual, dengan nomor resi ${data.ekspedisi.nomor_resi}`
        },
        data: {
            notification_type: 'order-service',
            id_order: `${data.order.id_order_produk}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesananmu telah dikirim',
                body: `Pesananmu telah dikirim oleh penjual, dengan nomor resi ${data.ekspedisi.nomor_resi}`,
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

OrderProduk.userCancelOrderProduk = async (order) => {
    const outlet = await Outlet.findOrFail(order.id_mitra)

    const getToken = await TokenOwner.query().where({ id_owner: outlet.id_owner }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan dibatalkan user',
            body: `Pesanan dengan invoice ${order.order_kode} dibatalkan karena ${order.order_cancel_description}`
        },
        data: {
            notification_type: 'order-service',
            id_order_service: `${order.id_order_service}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan dibatalkan user',
                body: `Pesanan dengan invoice ${order.order_kode} dibatalkan karena ${order.order_cancel_description}`,
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

OrderProduk.outletCancelOrderProduk = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const message = {
        notification: {
            title: 'Pesanan anda dibatalkan',
            body: `Pesanan dengan invoice ${order.order_kode} dibatalkan karena ${order.order_cancel_description}`
        },
        data: {
            notification_type: 'order-produk',
            id_order: `${order.id_order_produk}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan anda dibatalkan',
                body: `Pesanan dengan invoice ${order.order_kode} dibatalkan karena ${order.order_cancel_description}`,
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

OrderProduk.finishOrderProduk = async (order) => {
    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const thisOrder = await Order.findByOrFail('id_order_produk', order.id_order_produk)
    thisOrder.order_status = 5
    await thisOrder.save()

    const outlet = await Outlet.findBy('id_mitra', order.id_mitra)
    const total = order.toJSON().detailOrder.reduce((a, b) => +a + +b.harga_satuan * b.jumlah, 0)

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
            body: `Pesanan dengan invoice ${order.order_kode} telah selesai}`
        },
        data: {
            notification_type: 'order-produk',
            id_order: `${order.id_order_produk}`
        },
        android: {
            priority: 'high',
            notification: {
                title: 'Pesanan telah selesai',
                body: `Pesanan dengan invoice ${order.order_kode} telah selesai`,
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
