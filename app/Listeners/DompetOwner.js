'use strict'

const Histori = use('App/Models/HistoriDompetOwner')
const Dompet = use('App/Models/DompetOwner')

const DompetOwner = exports = module.exports = {}

DompetOwner.pendingPayment = async (requestData) => {
    const histori = await Histori.findBy('kode_transaksi', requestData.order_id)
    histori.status_transaksi = 1
    await histori.save()
}

DompetOwner.cancelPayment = async (requestData) => {
    const histori = await Histori.findBy('kode_transaksi', requestData.order_id)
    histori.status_transaksi = -1
    await histori.save()
}

DompetOwner.settlementPayment = async (requestData) => {
    const histori = await Histori.findBy('kode_transaksi', requestData.order_id)
    histori.status_transaksi = 2
    await histori.save()

    const dompet = await Dompet.find(histori.id_dompet)
    dompet.saldo += histori.nominal_transaksi
    await dompet.save()
}
