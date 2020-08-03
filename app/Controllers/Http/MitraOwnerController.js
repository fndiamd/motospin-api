'use strict'

const MitraOwner = use('App/Models/MitraOwner')

class MitraOwnerController {

    async index({ response }) {
        try{ 
            const result = await MitraOwner.query().fetch()
            return response.json(result)
        }catch(error){
            return response.status(400).send({
                message: 'Ops, kelihatannya ada yang tidak beres!'
            })
        }
    }

    async view({ params, response }){
        try {
            const result = await MitraOwner.findOrFail(params.id)
            return result
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }

            return response.status(400).send({
                message: 'Ops, sepertinya ada yang tidak beres!'
            })
        }
    }

    async store({ request, response}){
        try {
            const parseData = {
                owner_nama: request.input('owner_nama'),
                owner_telp: request.input('owner_telp'),
                owner_email: request.input('owner_email'),
                owner_password: request.input('owner_password')
            }

            const exec = await MitraOwner.create(parseData)
            return exec
        } catch (error) {
            return response.status(error.status).send(error)
        }
    }

}

module.exports = MitraOwnerController
