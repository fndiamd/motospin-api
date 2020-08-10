'use strict'

const Kendaraan = use('App/Models/Kendaraan')

class KendaraanController {

    async index({ auth, response, request }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'

            const authData = await auth.authenticator('user').getUser()
            const thisKendaraans = await Kendaraan
                .query()
                .where({ id_user: authData.id_user })
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)
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
                kendaraan_no_rangka: request.input('kendaraan_no_rangka'),
                kendaraan_no_mesin: request.input('kendaraan_no_mesin'),
                id_user: authData.id_user
            }

            const checkExists = await Kendaraan.query().where({ kendaraan_nopol: data.kendaraan_nopol }).first()
            if (checkExists) {
                return response.status(400).send({ message: 'Nomor polisi kendaraan sudah terpakai' })
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
            kendaraan_no_rangka: request.input('kendaraan_no_rangka'),
            kendaraan_no_mesin: request.input('kendaraan_no_mesin'),
            id_user: authData.id_user
        }

        try {

            const thisData = await Kendaraan.findOrFail(params.id)
            const checkExists = await Kendaraan.query().where({ kendaraan_nopol: dataUpdate.kendaraan_nopol }).first()
            if (checkExists && thisData.kendaraan_nopol != dataUpdate.kendaraan_nopol) {
                return response.json({ message: 'Nomor polisi kendaraan sudah terpakai' })
            }
            
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
            return error.message
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
