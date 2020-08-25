'use strict'

const Alamat = use('App/Models/AlamatUser')

class AlamatUserController {

    async index({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const result = await Alamat.query().where({ id_user: authData.id_user }).fetch()
            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ params, auth }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat
                .query().where({ id_user: authData.id_user, id: params.id }).first()

            if (!thisData) {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }

            return response.json(thisData)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ request, response, auth }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const data = {
                city_id: request.input('city_id'),
                province_id: request.input('province_id'),
                province: request.input('province'),
                type: request.input('type'),
                city_name: request.input('city_name'),
                postal_code: request.input('postal_code'),
                alamat: request.input('alamat'),
                id_user: authData.id_user
            }

            const checkFirst = await Alamat.query().where({ 'id_user': authData.id_user }).count('* as total')
            if (checkFirst[0]['total'] == 0) {
                data.primary = true
            }

            const exec = await Alamat.create(data)
            return response.json(exec)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ request, response, auth, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat
                .query().where({ id_user: authData.id_user, id: params.id }).first()

            if (!thisData) {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }

            const data = {
                city_id: request.input('city_id'),
                province_id: request.input('province_id'),
                province: request.input('province'),
                type: request.input('type'),
                city_name: request.input('city_name'),
                postal_code: request.input('postal_code'),
                alamat: request.input('alamat'),
                id_user: authData.id_user
            }

            const exec = await Alamat.query()
                .where({ id_user: authData.id_user, id: params.id })
                .update(data)
            if (exec) {
                return response.json(await Alamat.find(params.id))
            }

        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ params, auth, response }) {
        try {
            const thisData = await Alamat
                .query().where({ id_user: authData.id_user, id: params.id }).first()

            if (!thisData) {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            } else {
                const alamat = await Alamat.find(params.id)
                await alamat.delete()
                return response.json({ message: 'Alamat berhasil dihapus' })
            }
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async changePrimary({ auth, response, params }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            await Alamat.query().where({ id_user: authData.id_user, primary: true }).update({ primary: false })
            await Alamat.query().where({ id_user: authData.id_user, id: params.id }).update({ primary: true })
            return response.json({ message: 'Berhasil mengganti alamat utama' })
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }


}

module.exports = AlamatUserController
