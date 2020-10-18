'use strict'


const DetailOrder = use('App/Models/DetailOrderService')

class DetailOrderServiceController {

    async update({ params, response, request }){
        try {
            const thisData = await DetailOrder.findOrFail(params.id)
            thisData.detail_order_harga = request.input('harga')
            thisData.detail_catatan_outlet = request.input('catatan')
            await thisData.save()
            return response.ok(thisData)
        } catch (error) {
            return response.status(error.status).send({
                message: error.message
            })
        }

    }

}

module.exports = DetailOrderServiceController
