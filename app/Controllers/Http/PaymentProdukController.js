'use strict'

const axios = use('axios')
const moment = use('moment')
const base_url = 'https://app.sandbox.midtrans.com/snap/v1/transactions'

const Order = use('App/Models/OrderProduk')
const OrderDetail = use('App/Models/DetailOrderProduk')
const Ekspedisi = use('App/Models/PengirimanProduk')
const Payment = use('App/Models/PaymentProduk')

const Env = use('Env')
const Event = use('Event')
const key = Buffer.from(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')

class PaymentProdukController {

    async charge({ request, response, auth }) {
        const authData = await auth.authenticator('user').getUser()
        const idOrder = request.input('id_order')
        
        let total = 0

        const thisOrder = await Order.findOrFail(idOrder)
        const thisDetailOrder = await OrderDetail.query()
            .with('produk.kategori')
            .with('produk.merk')
            .where({ id_order_produk: idOrder })
            .fetch()
        const ekspedisi = await Ekspedisi.findBy('id_order_produk', idOrder)

        thisDetailOrder.toJSON().map(e => {
            total += e.produk.produk_harga * e.jumlah
        })
        total += ekspedisi.courier_cost
        const itemDetails = [
            {
                name: `Biaya Kirim by ${ekspedisi.courier.toUpperCase()}(${ekspedisi.courier_service})`,
                price: ekspedisi.courier_cost,
                quantity: 1
            }
        ]

        thisDetailOrder.toJSON().map(item => {
            itemDetails.push({
                name: item.produk.produk_nama,
                price: item.produk.produk_harga,
                category: item.produk.kategori.kategori_produk,
                brand: item.produk.merk.merk_produk,
                quantity: item.jumlah
            })
        })

        const transaction_data = {
            transaction_details: {
                order_id: thisOrder.order_kode,
                gross_amount: total
            },
            item_details: itemDetails,
            customer_details: {
                first_name: authData.user_nama,
                email: authData.user_email,
                phone: authData.user_telp
            },
            expiry: {
                start_time: moment().format('Y-MM-DD HH:mm:ss Z'),
                unit: "hour",
                duration: 24
            }
        }

        const httpReq = await axios.post(base_url, transaction_data, {
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

        await Payment.create({
            transaction_time: moment().format('Y-MM-DD HH:mm:ss Z'),
            transaction_id: httpReq.token,
            transaction_total: total,
            id_order_produk: idOrder
        })

        return response.json(httpReq)
    }

    async finish({ request, response }) {
        const req = request.all()
        const checkOrder = await Order.findBy('order_kode', req.order_id)
        if(!checkOrder)
            return response.status(404).send({ message: 'Transaction not found!' })
        
        const payment = await Payment.findBy('id_order_produk', checkOrder.id_order_produk)
        const statusPayment = await axios.get(`https://api.sandbox.midtrans.com/v2/${req.order_id}/status`, {
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

        let data = {}
        Object.keys(statusPayment).map(e => {
            if(e !== 'transaction_status' && e !== 'payment_type' && e != 'status_message' && e != 'status_code'){
                data[e] = statusPayment[e]
                
            }
        })

        payment.payment_detail = JSON.stringify(data)
        await payment.save()
        return payment
    }

    async notification({ request }) {
        try {
            const requestData = request.all()
            const order = await Order.findBy('order_kode', requestData.order_id)
            switch(requestData.transaction_status){
                case 'pending':
                    order.order_status = 1
                    Event.fire('request::paymentProduk', order)
                    break;
            }

            await order.save()
            return order
        } catch (error) {
            return error.message
        }
    }

}

module.exports = PaymentProdukController
