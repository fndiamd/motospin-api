'use strict'

const axios = use('axios')
const moment = use('moment')
const base_url = 'https://app.sandbox.midtrans.com/snap/v1/transactions'

const Order = use('App/Models/OrderProduk')
const OrderDetail = use('App/Models/DetailOrderProduk')

const Env = use('Env')

class PaymentProdukController {

    async charge({ request, response, auth }) {
        const authData = await auth.authenticator('user').getUser()
        const idOrder = request.input('id_order')
        const key = new Buffer(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')

        const thisOrder = await Order.findOrFail(idOrder)
        const thisDetailOrder = await OrderDetail.query()
            .with('produk.kategori')
            .with('produk.merk')
            .where({ id_order_produk: idOrder })
            .fetch()
        const itemDetails = []

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
                gross_amount: thisOrder.order_total
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
        return response.json(httpReq)
    }

}

module.exports = PaymentProdukController
