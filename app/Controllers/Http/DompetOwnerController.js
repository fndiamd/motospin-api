'use strict'

const Dompet = use('App/Models/DompetOwner')
const Histori = use('App/Models/HistoriDompetOwner')

const moment = use('moment')
const Env = use('Env')
const key = Buffer.from(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')
const axios = use('axios')

class DompetOwnerController {

    async index({ response, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.query().where({ id_owner: authData.id_owner }).fetch()

            return response.json(dompet)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async getCreditWallet({ response, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.query().where({
                id_owner: authData.id_owner,
                tipe_saldo: 'kredit'
            }).first()

            return dompet
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async getDebitWallet({ response, auth }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.query().where({
                id_owner: authData.id_owner,
                tipe_saldo: 'debit'
            }).first()

            return dompet
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async topUpCredit({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const transaction_data = {
                transaction_details: {
                    order_id: `SN${authData.id_owner}${moment().format('YDMHmmss')}`,
                    gross_amount: request.input('nominal')
                },
                item_details: {
                    name: `Top Up Saldo ${request.input('nominal')}`,
                    price: request.input('nominal'),
                    quantity: 1
                },
                customer_details: {
                    first_name: authData.owner_nama,
                    email: authData.owner_email,
                    phone: authData.owner_telp
                },
                expiry: {
                    start_time: moment().format('Y-MM-DD HH:mm:ss Z'),
                    unit: "hour",
                    duration: 24
                }
            }

            const httpReq = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions',
                transaction_data,
                {
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

            const dompet = await this.getCreditWallet({ auth, response })

            await Histori.create({
                id_dompet: dompet.id_dompet,
                kode_transaksi: transaction_data.transaction_details.order_id,
                nominal_transaksi: request.input('nominal'),
                status_transaksi: 0
            })

            return response.json(httpReq)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }



}

module.exports = DompetOwnerController
