'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

class GambarProdukController {

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/produk/${params.file}`))
    }

    async store({ request, response }) {
        try {
            const id_produk = request.input('id_produk')
            const imgProduct = request.file('img_produk', {
                types: ['image', 'jpg', 'png', 'jpeg'],
                size: '2mb'
            })

            await imgProduct.moveAll(Helpers.publicPath('uploads/produk'), (file) => {
                return {
                    name: `${id_produk}${new Date().getTime()}.${file.subtype}`
                }
            })

            const fs = Helpers.promisify(require('fs'))
            const removeFile = Helpers.promisify(fs.unlink)
            const movedFiles = imgProduct.movedList()

            if (!imgProduct.movedAll()) {

                await Promise.all(movedFiles.map((file) => {
                    return removeFile(path.join(file._location, file.fileName))
                }))

                return imgProduct.errors()
            }

            const gambars = []

            await Promise.all(movedFiles.map((file) => {
                gambars.push({
                    id_produk: id_produk,
                    gambar_url_path: `${Env.get('APP_URL')}/api/v1/gambar-produk/img-url/${id_produk}/${file.fileName}`
                })
            }))

            const gambarProduk = await GambarProduk.createMany(gambars)
            return gambarProduk
        } catch (error) {
            return response.status(error.status).send({
                sector: 'Gambar Produk',
                error: error.name,
                message: error.message
            })
        }
    }

}

module.exports = GambarProdukController
