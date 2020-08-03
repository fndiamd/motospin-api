'use strict'

const Pegawai = use('App/Models/MitraPegawai')
const PegawaiToken = use('App/Models/TokenPegawai')
const Mail = use('Mail')

class PegawaiController {
    async register({ request, auth, response }) {
        try {
            const data = {
                pegawai_nama: request.input('pegawai_nama'),
                pegawai_email: request.input('pegawai_email'),
                pegawai_telp: request.input('pegawai_telp'),
                pegawai_password: request.input('pegawai_password'),
                pegawai_level: request.input('pegawai_level'),
                id_mitra: request.input('id_mitra')
            }

            const telpExists = await Pegawai.findBy('pegawai_telp', data.pegawai_telp)
            const emailExists = await Pegawai.findBy('pegawai_email', data.pegawai_email)

            if (telpExists) {
                return response.status(400).send({
                    message: 'Nomor telepon sudah digunakan'
                })
            }

            if (emailExists) {
                return response.staus(400).send({
                    message: 'Email sudah digunakan'
                })
            }

            try {
                await Pegawai.create(data)
            } catch (error) {
                return error.message
            }

            const thisPegawai = await Pegawai.findBy('pegawai_telp', data.pegawai_telp)
            const accessToken = await auth.authenticator('pegawai').withRefreshToken().generate(thisPegawai)
            await PegawaiToken.create({
                pegawai_id: thisPegawai.id_pegawai,
                token: accessToken.token,
                type: accessToken.type,
                is_revoked: false
            })

            return response.json({
                "pegawai": thisPegawai,
                "access_token": accessToken
            })

        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async login({ auth, request, response }) {
        try {

            let pegawai_telp = request.input('pegawai_telp')
            let pegawai_password = request.input('pegawai_password')

            const thisPegawai = await Pegawai.findBy('pegawai_telp', pegawai_telp)
            const authentication = await auth.authenticator('pegawai').withRefreshToken().attempt(pegawai_telp, pegawai_password)

            return response.json({
                "pegawai": thisPegawai,
                "access_token": authentication
            })
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async logout({ auth, response }) {
        try {
            const apiToken = auth.getAuthHeader()
            await auth.authenticator('pegawai').revokeTokens([apiToken])
            return response.send({ message: 'Logged out' })
        } catch (error) {
            return response.status(error).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async forgotPassword({ auth, request, response }) {
        try {
            const thisPegawai = await Pegawai.findBy('pegawai_email', request.input('pegawai_email'))
            const thisToken = await auth.authenticator('pegawai').generate(thisPegawai)

            await PegawaiToken.create({
                pegawai_id: thisPegawai.id_pegawai,
                token: thisToken.token,
                type: "forgot-password",
                is_revoked: false
            })

            const nama = thisPegawai.pegawai_nama
            const link = "http://localhost:3333/api/v1/auth/pegawai-reset-password/" + thisToken.token

            await Mail.send('forgot-password', { nama, link }, (message) => {
                message.to(thisPegawai.pegawai_email).from('support@motospin.com').subject('[Reset Password] Account ' + thisPegawai.pegawai_nama + ' Motospin')
            })

            if (sendMail) {
                return response.status(200).send({ status: true })
            } else {
                return response.status(200).send({ status: false })
            }

        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async changePassword({ params, request, response }) {
        try {
            const thisToken = await PegawaiToken.query().where('token', params.token).first()
            let id_pegawai = thisToken.pegawai_id
            const thisPegawai = await Pegawai.findBy('id_pegawai', id_pegawai)

            const data = {
                new_password: request.input('new_password'),
                confirm_password: request.input('confirm_password')
            }

            if (data.new_password === data.confirm_password) {
                thisToken.is_revoked = true
                thisPegawai.pegawai_password = data.new_password
                await thisPegawai.save()
                await thisToken.save()

                return response.status(200).send({ status: true })
            } else {
                return response.status(400).send({ message: "password tidak sama" })
            }

        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }
}

module.exports = PegawaiController
