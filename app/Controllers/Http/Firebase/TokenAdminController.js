'use strict'

const Token = use('App/Models/FirebaseTokenAdmin')

class TokenAdminController {

    async store({auth, request, response}){
        try {
            const authData = await auth.authenticator('admin').getUser()
            const data = {
                id_admin: authData.id_admin,
                registration_token: request.input('registration_token')
            }

            const checkExists = await Token.query().where(data).first()
            if(checkExists){
                return response.send({
                    message: `registration token already exists for admin ${authData.admin_nama}`
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

    async delete({ auth, request, response }){
        try {
            const authData = await auth.authenticator('admin').getUser()
            const data = {
                id_admin: authData.id_admin,
                registration_token: request.input('registration_token')
            }
            const checkExists = await Token.query().where(data).first()
            if(!checkExists){
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

module.exports = TokenAdminController
