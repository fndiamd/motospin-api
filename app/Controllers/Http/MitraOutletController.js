'use strict'

const MitraOutlet = use('App/Models/MitraOutlet')

class MitraOutletController {

    async index({ response, params }) {
        try {
            const page = params.page || 1
            const result = await MitraOutlet
                .query()
                .orderBy('created_at', 'desc')
                .with('owner')
                .with('jenisMitra')
                .paginate(page, 8)
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const parseData = {
                mitra_nama: request.input('mitra_nama'),
                mitra_telp: request.input('mitra_telp'),
                mitra_alamat: request.input('mitra_alamat'),
                mitra_long: request.input('mitra_long'),
                mitra_lat: request.input('mitra_lat'),
                mitra_status: 0,
                id_jenis_mitra: request.input('id_jenis_mitra'),
                id_owner: authData.id_owner,
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

    async update({ auth, params, request, response }) {
        const authData = await auth.authenticator('owner').getUser()
        const dataUpdate = {
            mitra_nama: request.input('mitra_nama'),
            mitra_telp: request.input('mitra_telp'),
            mitra_alamat: request.input('mitra_alamat'),
            mitra_long: request.input('mitra_long'),
            mitra_lat: request.input('mitra_lat'),
            id_jenis_mitra: request.input('id_jenis_mitra'),
        }

        try {
            const updating = await MitraOutlet
                .query()
                .where({ id_owner: authData.id_owner, id_mitra: params.id })
                .update(dataUpdate)

            if (updating) {
                return await MitraOutlet.find(params.id)
            } else {
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }

        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.send(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const thisData = await MitraOutlet
                .query()
                .where({ id_mitra: params.id, id_owner: authData.id_owner })
                .first()

            if (thisData) {
                const outlet = await MitraOutlet.find(params.id)
                await outlet.delete()
                return response.json({ message: 'success' })
            } else {
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }
        } catch (error) {
            return response.send(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ params, response }) {
        try {
            const thisData = await MitraOutlet
                .query()
                .where({ id_mitra: params.id })
                .with('owner')
                .with('jenisMitra')
                .first()
            if (!thisData) {
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }
            return thisData
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async myOutlets({ auth,response, params }) {
        try {
            const page = params.page || 1
            const authData = await auth.authenticator('owner').getUser()
            const myOutlets = await MitraOutlet
                .query()
                .where({ id_owner: authData.id_owner })
                .orderBy('updated_at', 'desc')
                .paginate(page, 5)

            return response.json(myOutlets)
        } catch (error) { 
            return response.status(error.status).send({
                status: error.status,
                name: error.name,
                message: error.message
            })
        }
    }

}

module.exports = MitraOutletController
