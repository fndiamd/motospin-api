'use strict'

const Kendaraan = use('App/Models/Kendaraan')

class KendaraanController {

    async index({ auth, response, params }) {
        try {
            const page = params.page || 1
            const authData = await auth.authenticator('user').getUser()
            const thisKendaraans = await Kendaraan
                .query()
                .where({ id_user: authData.id_user })
                .orderBy('updated_at', 'desc')
                .paginate(page, 5)
            return response.json(thisKendaraans)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ auth, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisKendaraan = await Kendaraan.query().where({
                id_user: authData.id_user,
                id_kendaraan: params.id
            }).with('user').first()
            if (!thisKendaraan) {
                return response.json({ message: 'Kendaraan tidak ditemukan' })
            }
            return thisKendaraan
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
            const authData = await auth.authenticator('user').getUser()
            const data = {
                kendaraan_nopol: request.input('kendaraan_nopol'),
                kendaraan_merk: request.input('kendaraan_merk'),
                kendaraan_tipe: request.input('kendaraan_tipe'),
                kendaraan_tahun: request.input('kendaraan_tahun'),
                id_user: authData.id_user
            }

            const checkExists = await Kendaraan.query().where({ kendaraan_nopol: data.kendaraan_nopol }).first()
            if (checkExists) {
                return response.json({ message: 'Nomor polisi kendaraan sudah terpakai' })
            }

            let exec = await Kendaraan.create(data)
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ auth, request, response, params }) {
        const authData = await auth.authenticator('user').getUser()
        const dataUpdate = {
            kendaraan_nopol: request.input('kendaraan_nopol'),
            kendaraan_merk: request.input('kendaraan_merk'),
            kendaraan_tipe: request.input('kendaraan_tipe'),
            kendaraan_tahun: request.input('kendaraan_tahun'),
            id_user: authData.id_user
        }

        const checkExists = await Kendaraan.query().where({ kendaraan_nopol: dataUpdate.kendaraan_nopol }).first()
        if (checkExists) {
            return response.json({ message: 'Nomor polisi kendaraan sudah terpakai' })
        }

        try {
            const updating = await Kendaraan
                .query()
                .where({ id_user: authData.id_user, id_kendaraan: params.id })
                .update(dataUpdate)

            if (updating) {
                return await Kendaraan.find(params.id)
            } else {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(error.status).send({ message: 'Data tidak ditemukan' })
            }
            return error.name
        }
    }

    async delete({ auth, request, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisKendaraan = await Kendaraan
                .query()
                .where({ id_kendaraan: params.id, id_user: authData.id_user })
                .first()

            if (thisKendaraan) {
                const kendaraan = await Kendaraan.find(params.id)
                await kendaraan.delete()
                return response.json({ message: 'success' })
            } else {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
        } catch (error) {
            return error.message
        }
    }

}

module.exports = KendaraanController
