'use strict'

const MitraOutlet = use('App/Models/MitraOutlet')
const Env = use('Env')
const Helpers = use('Helpers')

class MitraOutletController {

    Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }

    distance(lat1, long1, lat2, long2) {
        lat1 = this.Deg2Rad(lat1);
        lat2 = this.Deg2Rad(lat2);
        long1 = this.Deg2Rad(long1);
        long2 = this.Deg2Rad(long2);
        var R = 6371; // km
        var x = (long2 - long1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }

    async index({ request, response }) {
        try {
            const pagination = request.only(['page', 'limit', 'column', 'sort'])
            let page = pagination.page || 1
            let limit = pagination.limit || 5
            let column = pagination.column || 'created_at'
            let sort = pagination.sort || 'desc'
            const result = await MitraOutlet
                .query()
                .with('owner')
                .with('jenisMitra')
                .orderBy(`${column}`, `${sort}`)
                .paginate(page, limit)

            return response.json(result)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async nearest({ request, response }) {
        try {

            const location = request.only(['lat', 'long'])
            const result = await MitraOutlet
                .query()
                .where({ id_jenis_mitra: 1 })
                .orderBy('created_at', 'desc')
                .with('owner')
                .with('jenisMitra')
                .fetch()

            const data = []

            result.toJSON().map(e => {
                if (this.distance(e.mitra_lat, e.mitra_long, location.lat, location.long) <= 20) {
                    data.push({
                        id_mitra: e.id_mitra,
                        mitra_nama: e.mitra_nama,
                        mitra_telp: e.mitra_telp,
                        mitra_alamat: e.mitra_alamat,
                        jenis_mitra: e.jenisMitra.jenis_mitra,
                        owner: e.owner.owner_nama,
                        mitra_status: e.mitra_status,
                        jarak: Math.round(this.distance(e.mitra_lat, e.mitra_long, location.lat, location.long) * 10) / 10 
                    })
                }
            })

            return data
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async store({ auth, request, response }) {
        try {
            const imgOutlet = request.file('img_outlet', {
                types: ['jpeg', 'jpg', 'png'],
                size: '2mb'
            })

            const authData = await auth.authenticator('owner').getUser()
            const fileName = `${authData.id_owner}-${imgOutlet.clientName}`

            const parseData = {
                mitra_nama: request.input('mitra_nama'),
                mitra_telp: request.input('mitra_telp'),
                mitra_alamat: request.input('mitra_alamat'),
                mitra_long: request.input('mitra_long'),
                mitra_lat: request.input('mitra_lat'),
                mitra_status: 1,
                mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/${fileName}`,
                id_jenis_mitra: request.input('id_jenis_mitra'),
                id_owner: authData.id_owner,
            }

            await imgOutlet.move(Helpers.publicPath('uploads/mitra-outlet'), {
                name: fileName,
                overwrite: true
            })

            if (!imgOutlet.moved()) {
                return imgOutlet.error()
            }

            const exec = await MitraOutlet.create(parseData)
            return exec
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async update({ auth, params, request, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const thisData = await MitraOutlet
                .query()
                .where({ id_owner: authData.id_owner, id_mitra: params.id })
                .first()
            if(!thisData){
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }

            const dataUpdate = {
                mitra_nama: request.input('mitra_nama'),
                mitra_telp: request.input('mitra_telp'),
                mitra_alamat: request.input('mitra_alamat'),
                mitra_long: request.input('mitra_long'),
                mitra_lat: request.input('mitra_lat'),
                id_jenis_mitra: request.input('id_jenis_mitra'),
                mitra_status: request.input('mitra_status')
            }

            if (request.file('img_outlet') != null) {
                const imgOutlet = request.file('img_outlet', {
                    types: ['jpeg', 'jpg', 'png'],
                    size: '2mb'
                })

                const fileName = `${authData.id_owner}-${imgOutlet.clientName}`

                await imgOutlet.move(Helpers.publicPath('uploads/kategori'), {
                    name: nameLogo,
                    overwrite: true
                })

                if (!imgOutlet.moved()) {
                    return imgOutlet.error()
                }

                thisData.mitra_img_path = `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/${fileName}`
            }

            try {
                thisData.mitra_nama = dataUpdate.mitra_nama
                thisData.mitra_telp = dataUpdate.mitra_telp
                thisData.mitra_alamat = dataUpdate.mitra_alamat
                thisData.mitra_long = dataUpdate.mitra_long
                thisData.mitra_lat = dataUpdate.mitra_lat
                thisData.mitra_status = dataUpdate.mitra_status

                await thisData.save()
                return response.json(thisData)
            } catch (error) {
                return error.message
            }

        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).send({
                    message: 'Data tidak ditemukan'
                })
            }
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async delete({ auth, params, response }) {
        try {
            const authData = await auth.authenticator('owner').getUser()
            const thisData = await MitraOutlet
                .query()
                .where({ id_mitra: params.id, id_owner: authData.id_owner })
                .first()

            if (thisData) {
                const outlet = await MitraOutlet.find(params.id)
                await outlet.delete()
                return response.json({ message: 'success' })
            } else {
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }
        } catch (error) {
            return response.send(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async view({ params, response }) {
        try {
            const thisData = await MitraOutlet
                .query()
                .where({ id_mitra: params.id })
                .with('owner')
                .with('jenisMitra')
                .first()
            if (!thisData) {
                return response.status(404).send({ message: 'Outlet tidak ditemukan' })
            }
            return thisData
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                error: error.name,
                message: error.message
            })
        }
    }

    async myOutlets({ auth, response, params }) {
        try {
            const page = params.page || 1
            const authData = await auth.authenticator('owner').getUser()
            const myOutlets = await MitraOutlet
                .query()
                .where({ id_owner: authData.id_owner })
                .orderBy('updated_at', 'desc')
                .paginate(page, 5)

            return response.json(myOutlets)
        } catch (error) {
            return response.status(error.status).send({
                status: error.status,
                name: error.name,
                message: error.message
            })
        }
    }

    async search({ request, response }) {
        let keywords = request.only(['mitra_nama', 'id_jenis_mitra'])
        let query;
        if (keywords.id_jenis_mitra == null) {
            query = `mitra_nama LIKE '%${keywords.mitra_nama}%'`
        } else if (keywords.mitra_nama == null) {
            query = `id_jenis_mitra = '${keywords.mitra_nama}'`
        } else {
            query = `mitra_nama LIKE '%${keywords.mitra_nama}%' AND id_jenis_mitra = ${keywords.id_jenis_mitra}`
        }

        try {
            const result = await MitraOutlet.query().whereRaw(query).fetch()
            return response.json(result)
        } catch (error) {
            return error.message
        }
    }

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/mitra_outlet/${params.file}`))
    }

}

module.exports = MitraOutletController
