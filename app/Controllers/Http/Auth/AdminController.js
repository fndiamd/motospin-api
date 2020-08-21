'use strict'

const Admin = use('App/Models/Admin')
const AdminToken = use('App/Models/TokenAdmin')

class AdminController {

    async login({ auth, request, response }) {
        try {

            let admin_email = request.input('admin_email')
            let admin_password = request.input('admin_password')

            const thisAdmin = await Admin.findBy('admin_email', admin_email)
            const authentication = await auth.authenticator('admin').withRefreshToken().attempt(admin_email, admin_password)

            return response.json({
                "admin": thisAdmin,
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
            await auth.authenticator('admin').revokeTokens([apiToken])
            return response.send({ message: 'Logged out' })
        } catch (error) {
            return response.status(error).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = AdminController
