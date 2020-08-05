'use strict'

const User = use('App/Models/User')
const UserToken = use('App/Models/Token')
const KodeUser = use('App/Models/KodeUser')
const Mail = use('Mail')
const MailChecker = require('./../../../../node_modules/mailchecker')

class UserController {

    async register({ request, auth, response }) {
        try {
            // data untuk registrasi
            const data = {
                user_nama: request.input('user_nama'),
                user_email: request.input('user_email'),
                user_telp: request.input('user_telp'),
                user_password: request.input('user_password'),
                user_status: 0
            }
            // pengecekan nomor telp yang telah digunakan
            const telpExists = await User.findBy('user_telp', data.user_telp)
            if (telpExists) {
                return response.status(400).send({
                    message: 'Nomor telpon sudah digunakan'
                })
            }
            // pengecekan email yang telah digunakan
            const emailExists = await User.findBy('user_email', data.user_email)
            if (emailExists) {
                return response.status(400).send({
                    message: 'Email sudah digunakan'
                })
            }

            if (!MailChecker.isValid(data.user_email)) {
                return response.status(400).send({
                    message: 'Email tidak valid'
                })
            }
            // insert into user
            await User.create(data)
            // get data user
            const thisUser = await User.findBy('user_telp', data.user_telp)
            // generate token untuk user
            const accessToken = await auth.authenticator('user').withRefreshToken().generate(thisUser)
            // insert into token
            await UserToken.create({
                user_id: thisUser.id_user,
                token: accessToken.token,
                type: accessToken.type,
                is_revoked: false
            })

            const kodeKonfirmasi = Math.floor(Math.random() * 899999 + 100000)
            // insert into kodeuser
            await KodeUser.create({
                id_user: thisUser.id_user,
                kode: kodeKonfirmasi,
                kode_status: 0
            })
            const nama = data.user_nama
            // kirim email konfirmasi
            await Mail.send('email-confirmation', { nama, kodeKonfirmasi }, (message) => {
                message.to(data.user_email).from('support@motospin.com').subject('[Kode Konfirmasi] Account Motospin')
            })

            return response.json({
                "user": thisUser,
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

            let user_telp = request.input('user_telp')
            let user_password = request.input('user_password')

            const thisUser = await User.findBy('user_telp', user_telp)
            await auth.authenticator('user').revokeTokensForUser(thisUser)

            const authentication = await auth.authenticator('user').withRefreshToken().attempt(user_telp, user_password)

            return response.json({
                "user": thisUser,
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
            await auth.authenticator('user').revokeTokens([apiToken], true)
            return response.send({ message: 'Logged out' })
        } catch (error) {
            return response.status(error).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async verifyAccount({ request, response }) {
        try {
            const thisCode = await KodeUser.query().where({
                id_user: request.input('id_user'),
                kode: request.input('kode'),
                kode_status: 0
            }).first()

            if (thisCode) {
                await User.query().where('id_user', request.input('id_user')).update({ user_status: 1 })
                await KodeUser.query().where({
                    id_user: request.input('id_user'),
                    kode: request.input('kode')
                }).update({ kode_status: 1 })
                return response.status(200).send({ status: true })
            } else {
                return response.status(400).send({ status: false })
            }
        } catch (error) {
            return response.status(error).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async requestCode({ request, response }) {
        try {
            const thisUser = await User.findBy('user_telp', request.input('user_telp'))
            const kodeKonfirmasi = Math.floor(Math.random() * 899999 + 100000)

            await KodeUser.query().where({ id_user: thisUser.id_user }).update({ kode_status: 1 })
            // insert into kodeuser
            await KodeUser.create({
                id_user: thisUser.id_user,
                kode: kodeKonfirmasi,
                kode_status: 0
            })

            const nama = thisUser.user_nama
            // kirim email konfirmasi
            const sendMail = await Mail.send('request-code', { nama, kodeKonfirmasi }, (message) => {
                message.to(thisUser.user_email).from('support@motospin.com').subject('[Kode Konfirmasi] Account Motospin')
            })

            if (sendMail) {
                return response.status(200).send({ status: true })
            } else {
                return response.status(400).send({ status: false })
            }
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async forgotPassword({ auth, request, response }) {
        try {
            const thisUser = await User.findBy('user_email', request.input('user_email'))
            if (!thisUser) {
                return response.json({ message: 'Email tidak terdaftar' })
            }
            const thisToken = await auth.authenticator('user').generate(thisUser)

            await UserToken.create({
                user_id: thisUser.id_user,
                token: thisToken.token,
                type: "forgot-password",
                is_revoked: false
            })

            const nama = thisUser.user_nama
            const link = "http://localhost:3333/api/v1/auth/user-reset-password/" + thisToken.token
            const sendMail = await Mail.send('forgot-password', { nama, link }, (message) => {
                message.to(thisUser.user_email).from('support@motospin.com').subject('[Reset Password] Account ' + thisUser.user_nama + ' Motospin')
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
            const thisToken = await UserToken.query().where('token', params.token).first()
            let id_user = thisToken.user_id
            const thisUser = await User.findBy('id_user', id_user)

            const data = {
                new_password: request.input('new_password'),
                confirm_password: request.input('confirm_password')
            }

            if (data.new_password === data.confirm_password) {
                thisToken.is_revoked = true
                thisUser.user_password = data.new_password
                await thisUser.save()
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

    async viewChangePassword({ params, view, response }) {
        const thisToken = await UserToken.findBy('token', params.token)
        if(thisToken){
            return view.render('change-password')
        }else{
            return view.render('404')
        }
    }
}

module.exports = UserController
