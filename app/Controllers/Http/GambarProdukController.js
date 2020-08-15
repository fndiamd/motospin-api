'use strict'

const Helpers = use('Helpers')

class GambarProdukController {

    async image_path({ response, params }) {
        return response.download(Helpers.publicPath(`uploads/produk/${params.file}`))
    }

}

module.exports = GambarProdukController
