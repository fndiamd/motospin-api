'use strict'

const Alamat = use('App/Models/AlamatUser')

class AlamatUserController {

    async index({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const result = await Alamat.query().where({ id_user: authData.id_user }).fetch()
            return response.ok(result)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat.findByOrFail({ id_user: authData.id_user, id: params.id })

            return response.ok(thisData)
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async store({ auth, response, request }) {
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
            return response.created(exec)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ auth, params, response, request }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat.findByOrFail({ id_user: authData.id_user, id: params.id })

            thisData.city_id = request.input('city_id'),
                thisData.province_id = request.input('province_id'),
                thisData.province = request.input('province'),
                thisData.type = request.input('type'),
                thisData.city_name = request.input('city_name'),
                thisData.postal_code = request.input('postal_code'),
                thisData.alamat = request.input('alamat'),
                thisData.id_user = authData.id_user

            await thisData.save();
            return response.ok(thisData)

        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async delete({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat.findByOrFail({ id_user: authData.id_user, id: params.id })

            await thisData.delete()
            return response.ok({ message: 'Alamat berhasil dihapus' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async getPrimary({ auth, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisData = await Alamat.findByOrFail({ id_user: authData.id_user, id: params.id })
            
            return response.ok(thisData)
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }

    async changePrimary({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            await Alamat.query().where({ id_user: authData.id_user, primary: true }).update({ primary: false })
            await Alamat.query().where({ id_user: authData.id_user, id: params.id }).update({ primary: true })
            
            return response.ok({ message: 'Berhasil mengganti alamat utama' })
        } catch (error) {
            switch (error.code) {
                case 'E_MISSING_DATABASE_ROW':
                    return response.status(error.status).send({
                        status: error.status,
                        message: 'Data tidak ditemukan'
                    })
                    break;
                default:
                    return response.status(error.status).send({
                        error: error.name,
                        message: error.message
                    })
                    break;
            }
        }
    }


}

module.exports = AlamatUserController
