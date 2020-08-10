'use strict'

const Owner = use('App/Models/MitraOwner')
const OwnerToken = use('App/Models/TokenOwner')
const KodeOwner = use('App/Models/KodeOwner')
const Mail = use('Mail')
const MailChecker = require('./../../../../node_modules/mailchecker')
const Env = use('Env')

class OwnerController {

    async register({ request, auth, response }) {
        try {
            const data = {
                owner_nama: request.input('owner_nama'),
                owner_email: request.input('owner_email'),
                owner_telp: request.input('owner_telp'),
                owner_password: request.input('owner_password'),
                owner_status: 0
            }

            const telpExists = await Owner.findBy('owner_telp', data.owner_telp)
            const emailExists = await Owner.findBy('owner_email', data.owner_email)

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

            if (!MailChecker.isValid(data.owner_email)) {
                return response.status(400).send({
                    message: 'Email tidak valid'
                })
            }

            await Owner.create(data)

            const thisOwner = await Owner.findBy('owner_telp', data.owner_telp)
            const accessToken = await auth.authenticator('owner').withRefreshToken().generate(thisOwner)
            await OwnerToken.create({
                owner_id: thisOwner.id_owner,
                token: accessToken.token,
                type: accessToken.type,
                is_revoked: false
            })

            const kodeKonfirmasi = Math.floor(Math.random() * 899999 + 100000)

            await KodeOwner.create({
                id_owner: thisOwner.id_owner,
                kode: kodeKonfirmasi,
                kode_status: 0
            })

            const nama = data.owner_nama

            await Mail.send('email-confirmation', { nama, kodeKonfirmasi }, (message) => {
                message.to(data.owner_email).from('support@motospin.com').subject('[Kode Konfirmasi] Account Motospin')
            })

            return response.json({
                "owner": thisOwner,
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

            let owner_telp = request.input('owner_telp')
            let owner_password = request.input('owner_password')

            const thisOwner = await Owner.findBy('owner_telp', owner_telp)
            const authentication = await auth.authenticator('owner').withRefreshToken().attempt(owner_telp, owner_password)

            return response.json({
                "owner": thisOwner,
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
            await auth.authenticator('owner').revokeTokens([apiToken])
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
            const thisCode = await KodeOwner.query().where({
                id_owner: request.input('id_owner'),
                kode: request.input('kode'),
                kode_status: 0
            }).first()

            if (thisCode) {
                await Owner.query().where('id_owner', request.input('id_owner')).update({ owner_status: 1 })
                await KodeOwner.query().where({
                    id_owner: request.input('id_owner'),
                    kode: request.input('kode')
                }).update({ kode_status: 1 })
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

    async requestCode({ request, response }) {
        try {
            const thisOwner = await Owner.findBy('owner_telp', request.input('owner_telp'))
            const kodeKonfirmasi = Math.floor(Math.random() * 899999 + 100000)

            await KodeOwner.query().where({ id_owner: thisOwner.id_owner }).update({ kode_status: 1 })

            await KodeOwner.create({
                id_owner: thisOwner.id_owner,
                kode: kodeKonfirmasi,
                kode_status: 0
            })

            const nama = thisOwner.owner_nama
            const sendMail = await Mail.send('request-code', { nama, kodeKonfirmasi }, (message) => {
                message.to(thisOwner.owner_email).from('support@motospin.com').subject('[Kode Konfirmasi] Owner Account Motospin')
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
            const thisOwner = await Owner.findBy('owner_email', request.input('owner_email'))
            const thisToken = await auth.authenticator('owner').generate(thisOwner)

            await OwnerToken.create({
                owner_id: thisOwner.id_owner,
                token: thisToken.token,
                type: "forgot-password",
                is_revoked: false
            })

            const nama = thisOwner.owner_nama
            const link = `${Env.APP_URL}api/v1/auth/owner-reset-password/${thisToken.token}`
            const sendMail = await Mail.send('forgot-password', { nama, link }, (message) => {
                message.to(thisOwner.owner_email).from('support@motospin.com').subject('[Reset Password] Account ' + thisOwner.owner_nama + ' Motospin')
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
            const thisToken = await OwnerToken.query().where('token', params.token).first()
            let id_owner = thisToken.owner_id
            const thisOwner = await Owner.findBy('id_owner', id_owner)
            
            const data = {
                new_password: request.input('new_password'),
                confirm_password: request.input('confirm_password')
            }

            if(data.new_password === data.confirm_password){
                thisToken.is_revoked = true
                thisOwner.owner_password = data.new_password
                await thisOwner.save()
                await thisToken.save()

                return response.status(200).send({status: true})
            }else{
                return response.status(400).send({message: "password tidak sama"})
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
        const thisToken = await OwnerToken.findBy('token', params.token)
        if(thisToken){
            return view.render('change-password')
        }else{
            return view.render('404')
        }
    }

    async update({ auth, request, response }){
        try {
            const authData = await auth.authenticator('owner').getUser()
            const thisOwner = await Owner.findOrFail(authData.id_owner)
            const dataUpdate = {
                owner_nama: request.input('owner_nama'),
                owner_email: request.input('owner_email'),
                owner_telp: request.input('owner_telp')
            }

            thisOwner.owner_nama = dataUpdate.owner_nama
            thisOwner.owner_email = dataUpdate.owner_email
            thisOwner.owner_telp = dataUpdate.owner_telp

            await thisOwner.save()
            return response.json(thisOwner)
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.json({ message: 'Owner tidak ditemukan!'})
            }
            return error.message
        }
    }

    async updatePassword({ auth, request, response }){
        try {
            const authData = await auth.authenticator('owner').getUser()
            const thisOwner = await Owner.findOrFail(authData.id_owner)

            if(request.input('new_password') === request.input('confirm_password')){
                thisOwner.owner_password = request.input('new_password')
                await thisOwner.save()
                return response.json({ message: 'success'})
            }else{
                return response.json({ message: 'Confirm password does\'t match' })
            }
        } catch (error) {
            if(error.name === 'ModelNotFoundException'){
                return response.json({ message: 'Owner tidak ditemukan'})
            }
            return error.message
        }
    }

}

module.exports = OwnerController
