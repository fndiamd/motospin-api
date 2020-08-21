'use strict'

const Token = use('App/Models/FirebaseTokenPegawai')

class TokenPegawaiController {

    async store({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('pegawai').getUser()
            const data = {
                id_pegawai: authData.id_pegawai,
                registration_token: request.input('registration_token')
            }

            const checkExists = await Token.query().where(data).first()
            if (checkExists) {
                return response.send({
                    message: `registration token already exists for pegawai ${authData.pegawai_nama}`
                })
            }

            const storeResult = await Token.create(data)
            return response.json(storeResult)
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('pegawai').getUser()
            const data = {
                id_pegawai: authData.id_pegawai,
                registration_token: request.input('registration_token')
            }
            const checkExists = await Token.query().where(data).first()
            if (!checkExists) {
                return response.status(400).send({
                    message: `data token not found`
                })
            }

            await Token.query().where(data).delete()
            return response.json({ message: 'token has deleted' })
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = TokenPegawaiController
