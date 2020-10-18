'use strict'

const User = use('App/Models/User')
const UserToken = use('App/Models/Token')
const KodeUser = use('App/Models/KodeUser')

const MailChecker = require('./../../../../node_modules/mailchecker')
const Env = use('Env')
const Event = use('Event')

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
            const emailData = {
                nama: nama,
                kodeKonfirmasi: kodeKonfirmasi,
                penerima: data.user_email
            }

            Event.fire('registered::user', emailData)

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
        const { user_telp, user_password } = request.post()

        try {
            const thisUser = await User.findBy('user_telp', user_telp)
            await auth.authenticator('user').revokeTokensForUser(thisUser)

            const authentication = await auth.authenticator('user').withRefreshToken().attempt(user_telp, user_password)

            return response.json({
                "user": thisUser,
                "access_token": authentication
            })
        } catch (error) {
            switch(error.code){
                case 'E_USER_NOT_FOUND':
                    return response.status(404).send({
                        message: 'Nomor telepon tidak terdaftar'
                    })
                    break;
                case 'E_PASSWORD_MISMATCH':
                    return response.status(401).send({
                        message: 'Password yang anda masukan salah!'
                    })
                    break;
            }
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

    async verifyAccount({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisCode = await KodeUser.query().where({
                id_user: authData.id_user,
                kode: request.input('kode'),
                kode_status: 0
            }).first()

            if (thisCode) {
                await User.query().where('id_user', authData.id_user).update({ user_status: 1 })
                await KodeUser.query().where({
                    id_user: authData.id_user,
                    kode: request.input('kode')
                }).update({ kode_status: 1 })

                return response.status(200).send({
                    status: true,
                    message: 'Akun anda berhasil diverifikasi'
                })
            } else {
                return response.status(400).send({
                    status: false,
                    message: 'Kode verifikasi tidak valid'
                })
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
            const emailData = {
                nama: nama,
                kodeKonfirmasi: kodeKonfirmasi,
                penerima: thisUser.user_email
            }
            // kirim email konfirmasi
            Event.fire('requestCode::user', emailData)

            return response.status(200).send({
                status: true,
                message: 'Kode konfirmasi berhasil dikirimkan ke email'
            })
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

            const emailData = {
                nama: nama,
                link: link,
                penerima: thisUser.user_email
            }

            Event.fire('forgotPassword::user', emailData)

            return response.status(200).send({
                status: true,
                message: 'Link request password berhasil dikirimkan ke email'
            })

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

                return response.status(200).send({
                    status: true,
                    message: 'Password anda berhasil diubah'
                })
            } else {
                return response.status(400).send({
                    status: false,
                    message: 'Konfirmasi password baru anda tidak sama'
                })
            }

        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async viewChangePassword({ params, view }) {
        const thisToken = await UserToken.findBy('token', params.token)
        if (thisToken) {
            return view.render('change-password')
        } else {
            return view.render('404')
        }
    }

    async update({ auth, request, response }) {
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
            if (error.name === 'ModelNotFoundException') {
                return response.json({ message: 'User tidak ditemukan' })
            }
            return error.message
        }
    }

    async updatePassword({ auth, request, response }) {
        try {
            const authData = await auth.authenticator('user').getUser()
            const thisUser = await User.findOrFail(authData.id_user)

            if (request.input('new_password') === request.input('confirm_password')) {
                thisUser.user_password = request.input('new_password')
                await thisUser.save()
                return response.json({ message: 'success' })
            } else {
                return response.json({ message: 'Confirm password does\'t match' })
            }
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.json({ message: 'User tidak ditemukan' })
            }
            return error.message
        }
    }

    async redirectToProvider({ ally, params }) {
        try {
            await ally.driver(params.provider).redirect()
        } catch (error) {
            return response.status(error.status).send({
                error: error.name,
                message: error.message
            })
        }
    }

    async handleProviderCallback({ params, ally, auth, response }) {

        try {
            const provider = params.provider
            const userData = await ally.driver(provider).getUser()

            const thisUser = await User.query().where({
                'provider': provider,
                'provider_id': userData.getId()
            }).first()

            if (thisUser) {
                try {
                    const token = await auth.authenticator('user').withRefreshToken().generate(thisUser)
                    return response.json({
                        user: thisUser,
                        accessToken: token
                    })
                } catch (error) {
                    return error.message
                }

            } else {
                const data = {
                    user_nama: userData.getName(),
                    user_email: userData.getEmail(),
                    provider_id: userData.getId(),
                    user_avatar_path: userData.getAvatar(),
                    provider: provider,
                    user_level: 0
                }

                const user = await User.create(data)
                const token = await auth.authenticator('user').withRefreshToken().generate(user)
                return response.json({
                    user: user,
                    accessToken: token
                })
            }

        } catch (e) {
            return response.status(e.status).send({
                error: e.name,
                message: e.message
            })
        }
    }
}

module.exports = UserController
