'use strict'

const Firebase = require('firebase-admin')
const Token = use('App/Models/FirebaseTokenUser')
const Order = use('App/Models/OrderProduk')
const Payment = use('App/Models/PaymentProduk')
const OrderDetail = use('App/Models/DetailOrderProduk')
const Produk = use('App/Models/Produk')

const Env = use('Env')
const key = Buffer.from(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')
const axios = use('axios')

const PaymentProduk = exports = module.exports = {}

PaymentProduk.pendingPaymentProduk = async (requestData) => {
    // Update order produk status
    const order = await Order.findBy('order_kode', requestData.order_id)
    order.order_status = 1
    await order.save()

    const produkOrder = await OrderDetail.query()
        .with('produk')
        .where({ id_order_produk: order.id_order_produk }).fetch()
    const payment = await Payment.findBy('id_order_produk', order.id_order_produk)
    const statusPayment = await axios.get(`https://api.sandbox.midtrans.com/v2/${requestData.order_id}/status`, {
        headers: {
            'Authorization': `Basic ${key}`,
            'Content-Type': 'application/json',
            'Accept': 'Accept'
        }
    }).then(result => {
        return result.data
    }).catch(err => {
        return err
    })

    payment.transaction_status = statusPayment.transaction_status
    payment.payment_type = statusPayment.payment_type

    let detailPayment = {}
    Object.keys(statusPayment).map(e => {
        if (e !== 'transaction_status' && e !== 'payment_type' && e != 'status_message' && e != 'status_code') {
            detailPayment[e] = statusPayment[e]
        }
    })

    for (let ow of produkOrder.rows) {
        await Produk.query().where({ id_produk: ow.id_produk })
            .update({ produk_stok: ow.toJSON().produk.produk_stok - ow.jumlah })
    }

    payment.payment_detail = JSON.stringify(detailPayment)
    await payment.save()

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
        console.log(error.message)
    }

}

PaymentProduk.cancelPaymentProduk = async (requestData) => {
    const order = await Order.findBy('order_kode', requestData.order_id)
    order.order_status = -1
    await order.save()

    const produkOrder = await OrderDetail.query()
        .with('produk')
        .where({ id_order_produk: order.id_order_produk }).fetch()
    for (let ow of produkOrder.rows) {
        await Produk.query().where({ id_produk: ow.id_produk })
            .update({ produk_stok: ow.toJSON().produk.produk_stok + ow.jumlah })
    }

    const payment = await Payment.findBy('id_order_produk', order.id_order_produk)
    const statusPayment = await axios.get(`https://api.sandbox.midtrans.com/v2/${requestData.order_id}/status`, {
        headers: {
            'Authorization': `Basic ${key}`,
            'Content-Type': 'application/json',
            'Accept': 'Accept'
        }
    }).then(result => {
        return result.data
    }).catch(err => {
        return err
    })

    payment.transaction_status = statusPayment.transaction_status
    payment.payment_type = statusPayment.payment_type

    let detailPayment = {}
    Object.keys(statusPayment).map(e => {
        if (e !== 'transaction_status' && e !== 'payment_type' && e != 'status_message' && e != 'status_code') {
            detailPayment[e] = statusPayment[e]
        }
    })

    payment.payment_detail = JSON.stringify(detailPayment)
    await payment.save()

    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const data = {
        title: 'Pesanan dibatalkan',
        body: `Pesanan dengan nomor ${order.order_kode} telah dibatalkan, lihat detailnya`
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

PaymentProduk.settlementPaymentProduk = async (requestData) => {
    const order = await Order.findBy('order_kode', requestData.order_id)
    order.order_status = 2
    await order.save()

    const payment = await Payment.findBy('id_order_produk', order.id_order_produk)
    const statusPayment = await axios.get(`https://api.sandbox.midtrans.com/v2/${requestData.order_id}/status`, {
        headers: {
            'Authorization': `Basic ${key}`,
            'Content-Type': 'application/json',
            'Accept': 'Accept'
        }
    }).then(result => {
        return result.data
    }).catch(err => {
        return err
    })

    payment.transaction_status = statusPayment.transaction_status
    payment.payment_type = statusPayment.payment_type

    let detailPayment = {}
    Object.keys(statusPayment).map(e => {
        if (e !== 'transaction_status' && e !== 'payment_type' && e != 'status_message' && e != 'status_code') {
            detailPayment[e] = statusPayment[e]
        }
    })

    payment.payment_detail = JSON.stringify(detailPayment)
    await payment.save()

    const getToken = await Token.query().where({ id_user: order.id_user }).fetch()
    const registrationToken = []

    getToken.toJSON().map(e => {
        registrationToken.push(e.registration_token)
    })

    const data = {
        title: 'Pembayaran berhasil',
        body: `Pembayaran untuk pesanan ${order.order_kode} telah berhasil`
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
