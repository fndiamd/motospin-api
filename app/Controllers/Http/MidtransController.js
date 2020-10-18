'use strict'

const Event = use('Event')
const axios = use('axios')
const Env = use('Env')
const key = Buffer.from(`${Env.get('MIDTRANS_SERVER_KEY')}:`).toString('base64')

class MidtransController {

    async notification({ request }) {
        const requestData = request.all()
        if(requestData.order_id.includes('SPR')){
            // payment produk
            switch(requestData.status_code){
                case "200":
                    Event.fire('settlement::paymentProduk', requestData)
                    Event.fire('notifOutlet::orderProduk', requestData)
                    break;
                case "201":
                    Event.fire('pending::paymentProduk', requestData)
                    break;
                case "202":
                    Event.fire('cancel::paymentProduk', requestData)
                    break;
            }
        }else if(requestData.order_id.includes('SN')){
            // payment topup dompet owner
            switch(requestData.status_code){
                case "200":
                    Event.fire('settlement::dompetOwner', requestData)
                    break;
                case "201":
                    Event.fire('pending::dompetOwner', requestData)
                    break;
                case "202":
                    Event.fire('cancel::dompetOwner', requestData)
                    break;
            }
        }
    }

    async finish({ request, response }){
        const req = request.all()
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

        return response.json(statusPayment)
    }

}

module.exports = MidtransController
