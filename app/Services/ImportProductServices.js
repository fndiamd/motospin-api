const Excel = require('exceljs')
const Produk = use('App/Models/Produk')
const Kategori = use('App/Models/KategoriProduk')
const Merk = use('App/Models/MerkProduk')

class ImportProductServices {
    static async ImportClassification(mitraID, filelocation) {
        let workbook = new Excel.Workbook()
        workbook = await workbook.xlsx.readFile(filelocation)
        let explanation = workbook.getWorksheet('Sheet1')
        let colComment = explanation.getColumn(1)

        colComment.eachCell(async (cell, rowNumber) => {

            if (rowNumber > 1) {

                let namaProduk = explanation.getCell('B' + rowNumber).value
                let harga = explanation.getCell('C' + rowNumber).value
                let stok = explanation.getCell('D' + rowNumber).value
                let berat = explanation.getCell('E' + rowNumber).value
                let deskripsi = explanation.getCell('F' + rowNumber).value
                let kategori = explanation.getCell('G' + rowNumber).value
                let merk = explanation.getCell('H' + rowNumber).value

                let kategoriProduk = await Kategori
                    .query()
                    .whereRaw(`LOWER(kategori_produk) = '${kategori.toLowerCase()}'`)
                    .first()
                let merkProduk = await Merk
                    .query()
                    .whereRaw(`LOWER(merk_produk) = '${merk.toLowerCase()}'`)
                    .first()

                let dataProduk = {
                    produk_nama: namaProduk,
                    produk_stok: stok,
                    produk_berat: berat,
                    produk_harga: harga,
                    produk_deskripsi: deskripsi,
                    id_kategori_produk: kategoriProduk.id_kategori_produk || 1,
                    id_merk_produk: merkProduk.id_merk_produk || 1,
                    id_mitra: mitraID
                }

                await Produk.create(dataProduk)
            }
            return 'error'
        })
    }
}

module.exports = ImportProductServices