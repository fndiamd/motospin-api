'use strict'

const Kendaraan = use('App/Models/KendaraanUser')

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
                .with('merk')
                .with('tipe')
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
                id_kendaraan_user: params.id
            })
            .with('user')
            .with('merk')
            .with('tipe')
            .first()
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
                kendaraan_user_nopol: request.input('kendaraan_nopol'),
                id_merk_kendaraan: request.input('id_merk_kendaraan'),
                id_tipe_kendaraan: request.input('id_tipe_kendaraan'),
                kendaraan_user_tahun: request.input('kendaraan_tahun'),
                kendaraan_user_no_rangka: request.input('kendaraan_no_rangka'),
                kendaraan_user_no_mesin: request.input('kendaraan_no_mesin'),
                kendaraan_user_transmisi: request.input('kendaraan_transmisi'),
                kendaraan_user_warna: request.input('kendaraan_warna'),
                id_user: authData.id_user,
                kendaraan_utama: false
            }

            const countCar = await Kendaraan.query().where({ 'id_user': authData.id_user }).count('* as total')

            if (countCar[0]['total'] == 0) {
                data.kendaraan_utama = true
            }
            const checkExists = await Kendaraan.query().where({ kendaraan_user_nopol: data.kendaraan_user_nopol }).first()
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
            kendaraan_user_nopol: request.input('kendaraan_nopol'),
            id_merk_kendaraan: request.input('id_merk_kendaraan'),
            id_tipe_kendaraan: request.input('id_tipe_kendaraan'),
            kendaraan_user_tahun: request.input('kendaraan_tahun'),
            kendaraan_user_no_rangka: request.input('kendaraan_no_rangka'),
            kendaraan_user_no_mesin: request.input('kendaraan_no_mesin'),
            id_user: authData.id_user
        }

        try {

            const thisData = await Kendaraan.findOrFail(params.id)
            const checkExists = await Kendaraan.query().where({ kendaraan_user_nopol: dataUpdate.kendaraan_user_nopol }).first()
            if (checkExists && thisData.kendaraan_user_nopol != dataUpdate.kendaraan_user_nopol) {
                return response.json({ message: 'Nomor polisi kendaraan sudah terpakai' })
            }

            const updating = await Kendaraan
                .query()
                .where({ id_user: authData.id_user, id_kendaraan_user: params.id })
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
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisKendaraan = await Kendaraan
                .query()
                .where({ id_kendaraan_user: params.id, id_user: authData.id_user })
                .first()

            if (thisKendaraan) {
                const kendaraan = await Kendaraan.find(params.id)
                await kendaraan.delete()
                return response.json({ message: 'success' })
            } else {
                return response.status(404).send({ message: 'Data tidak ditemukan' })
            }
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async swapPrimaryCar({ auth, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            await Kendaraan.query().where({ id_user: authData.id_user, kendaraan_utama: true }).update({ kendaraan_utama: false })
            await Kendaraan.query().where({ id_user: authData.id_user, id_kendaraan_user: params.id }).update({ kendaraan_utama: true })
            return response.json({ message: 'Berhasil mengganti mobil utama' })
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async getPrimaryCar({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const primaryCar = await Kendaraan
                .query()
                .with('tipe')
                .with('merk')
                .where({ id_user: authData.id_user, kendaraan_utama: true })
                .first()
            return response.json(primaryCar)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = KendaraanController
