'use strict'

const Dompet = use('App/Models/DompetOwner')
const Histori = use('App/Models/HistoriDompetOwner')

const moment = use('moment')
const Env = use('Env')
const key = Buffer.from(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')
const axios = use('axios')

class DompetOwnerController {

    async index({ auth, response }) {
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

    async getCreditWallet({ auth, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.query().where({
                id_owner: authData.id_owner,
                tipe_saldo: 'kredit'
            }).first()

            return response.ok(dompet)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async getDebitWallet({ auth, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.query().where({
                id_owner: authData.id_owner,
                tipe_saldo: 'debit'
            }).first()

            return response.ok(dompet)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async topUpCredit({ auth, response, request }) {
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

    async historyDebitWallet({ auth, response }) {
        const pagination = request.only(['page', 'limit', 'column', 'sort'])
        let page = pagination.page || 1
        let limit = pagination.limit || 10
        let column = pagination.column || 'created_at'
        let sort = pagination.sort || 'desc'

        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.findBy({ id_owner: authData.id_owner, tipe_saldo: 'debit' })
            const histori = await Histori
                .query()
                .where('id_dompet', dompet.id_dompet)
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)

            return response.ok({
                dompet: dompet,
                histori: histori
            })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }

    }

    async historyCreditWallet({ response, auth, request }) {
        const pagination = request.only(['page', 'limit', 'column', 'sort'])
        let page = pagination.page || 1
        let limit = pagination.limit || 10
        let column = pagination.column || 'created_at'
        let sort = pagination.sort || 'desc'

        try {
            const authData = await auth.authenticator('owner').getUser()
            const dompet = await Dompet.findBy({ id_owner: authData.id_owner, tipe_saldo: 'kredit' })
            const histori = await Histori
                .query()
                .where('id_dompet', dompet.id_dompet)
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)

            return response.ok({
                dompet: dompet,
                histori: histori
            })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }

    }

}

module.exports = DompetOwnerController
