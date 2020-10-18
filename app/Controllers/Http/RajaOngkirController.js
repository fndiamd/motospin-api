'use strict'

const axios = use('axios')
const Env = use('Env')
const MitraOutlet = use('App/Models/MitraOutlet')
const Alamat = use('App/Models/AlamatUser')

class RajaOngkirController {

    async getProvince({ request, response }) {
        try {
            const req = await axios.get('https://api.rajaongkir.com/starter/province', {
                headers: { 'key': Env.get('RAJAONGKIR_KEY') },
                params: { id: request.input('id') }
            }).then(result => {
                return result.data.rajaongkir
            }).catch(err => {
                return err
            })

            return response.send(req)
        } catch (error) {
            return error.message
        }
    }

    async getCity({ request, response }) {
        try {
            const req = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: { 'key': Env.get('RAJAONGKIR_KEY') },
                params: {
                    id: request.input('id'),
                    province: request.input('province')
                }
            }).then(result => {
                return result.data.rajaongkir
            }).catch(err => {
                return err
            })

            return response.send(req)
        } catch (error) {
            return error.message
        }
    }

    async calculateCost({ auth, request, response }){
        try {
            const authData = await auth.authenticator('user').getUser()
            const mitra = await MitraOutlet.find(request.input('id_mitra'))
            const alamatUser = await Alamat.query().where({ id_user: authData.id_user, primary: true }).first()
            const data = {
                origin: mitra.city_id,
                destination: request.input('city_id') || alamatUser.city_id,
                weight: request.input('weight'),
                courier: request.input('courier')
            }

            const req = await axios.post('https://api.rajaongkir.com/starter/cost', data, {
                headers: { 'key': Env.get('RAJAONGKIR_KEY') },
            }).then(result => {
                return result.data.rajaongkir
            }).catch(err => {
                return err
            })

            return response.json(req)

        } catch (error) {
            return error.message
        }
    }

}

module.exports = RajaOngkirController
