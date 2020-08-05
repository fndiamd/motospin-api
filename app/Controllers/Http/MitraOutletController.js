'use strict'

const MitraOutlet = use('App/Models/MitraOutlet')

class MitraOutletController {

    async index({ response }) {
        try {
            const result = await MitraOutlet.query().fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response }) {
        try {
            const parseData = {
                mitra_nama: request.input('mitra_nama'),
                mitra_telp: request.input('mitra_telp'),
                mitra_alamat: request.input('mitra_alamat'),
                mitra_long: request.input('mitra_long'),
                mitra_lat: request.input('mitra_lat'),
                mitra_status: 0,
                id_jenis_mitra: request.input('id_jenis_mitra'),
                id_owner: request.input('id_owner'),
            }

            const exec = await MitraOutlet.create(parseData)
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ params, request, response }) {
        try {
            const thisData = await MitraOutlet.findOrFail(params.id)
            const updateData = {
                mitra_nama: request.input('mitra_nama'),
                mitra_telp: request.input('mitra_telp'),
                mitra_alamat: request.input('mitra_alamat'),
                mitra_long: request.input('mitra_long'),
                mitra_lat: request.input('mitra_lat'),
                id_jenis_mitra: request.input('id_jenis_mitra'),
            }

            thisData.mitra_nama = updateData.mitra_nama
            thisData.mitra_telp = updateData.mitra_telp
            thisData.mitra_alamat = updateData.mitra_alamat
            thisData.mitra_long = updateData.mitra_long
            thisData.mitra_lat = updateData.mitra_lat
            thisData.id_jenis_mitra = updateData.id_jenis_mitra

            await thisData.save()
            return response.json(thisData)

        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return error.message
        }
    }

    async delete({ params, response }) {
        try {
            const thisData = await MitraOutlet.findOrFail(params.id)
            await thisData.delete()
            return response.json({ message: "Data dihapus"})
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return error.message
        }
    }

    async view() { }

}

module.exports = MitraOutletController
