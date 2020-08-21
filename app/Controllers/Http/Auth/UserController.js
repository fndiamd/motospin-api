'use strict'

const User = use('App/Models/User')
const UserToken = use('App/Models/Token')
const KodeUser = use('App/Models/KodeUser')
const Mail = use('Mail')
const MailChecker = require('./../../../../node_modules/mailchecker')
const Env = use('Env')

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
            if(error.name === 'PasswordMisMatchException'){
                return response.status(401).send({ message: 'Password salah! Cek kembali password anda' })
            }

            if(error.name === 'ModelNotFoundException'){
                return response.status(404).send({ message: 'User tidak terdaftar!' })
            }
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
            const link = `${Env.APP_URL}api/v1/auth/user-reset-password/${thisToken.token}`
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

                return response.status(200).send({ status: 'Berhasil ganti password!' })
            } else {
                return response.status(400).send({ message: "Password tidak sama" })
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

    async update({ auth, request, response }){
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisUser = await User.findOrFail(authData.id_user)
            const dataUpdate = {
                user_nama: request.input('user_nama'),
                user_email: request.input('user_email'),
                user_telp: request.input('user_telp')
            }

            thisUser.user_nama = dataUpdate.user_nama
            thisUser.user_email = dataUpdate.user_email
            thisUser.user_telp = dataUpdate.user_telp

            await thisUser.save()
            return response.json(thisUser)
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.json({ message: 'User tidak ditemukan'})
            }
            return error.message
        }
    }

    async updatePassword({ auth, request, response }){
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisUser = await User.findOrFail(authData.id_user)

            if(request.input('new_password') === request.input('confirm_password')){
                thisUser.user_password = request.input('new_password')
                await thisUser.save()
                return response.json({ message: 'success'})
            }else{
                return response.json({ message: 'Confirm password does\'t match' })
            }
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.json({ message: 'User tidak ditemukan'})
            }
            return error.message
        }
    }

    async handleProviderCallback ({params, ally, auth, response}) {
        const provider = params.provider
        try {
            const userData = await ally.driver(provider).getUser()

            // const authUser = await User.query().where({
            //     'provider': provider,
            //     'provider_id': userData.getId()
            // }).first()

            return userData
            // if (!(authUser === null)) {
            //     await auth.loginViaId(authUser.id)
            //     return response.redirect('/')
            // }

            // const user = new User()
            // user.name = userData.getName()
            // user.username = userData.getNickname()
            // user.email = userData.getEmail()
            // user.provider_id = userData.getId()
            // user.avatar = userData.getAvatar()
            // user.provider = provider

            // await user.save()

            // await auth.loginViaId(user.id)
            // return response.redirect('/')
        } catch (e) {
            return response.status(e.status).send({
                error: e.name,
                message: e.message
            })
        }
    }
}

module.exports = UserController
