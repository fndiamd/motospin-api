'use strict'

/*
|--------------------------------------------------------------------------
| DompetOwnerSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Dompet = use('App/Models/DompetOwner')

class DompetOwnerSeeder {
  async run() {
    const data = [
      { id_owner: 1, tipe_saldo: 'kredit' },
      { id_owner: 1, tipe_saldo: 'debit' },
      { id_owner: 2, tipe_saldo: 'kredit' },
      { id_owner: 2, tipe_saldo: 'debit' },
      { id_owner: 3, tipe_saldo: 'kredit' },
      { id_owner: 3, tipe_saldo: 'debit' },
      { id_owner: 4, tipe_saldo: 'kredit' },
      { id_owner: 4, tipe_saldo: 'debit' },
      { id_owner: 5, tipe_saldo: 'kredit' },
      { id_owner: 5, tipe_saldo: 'debit' },
      { id_owner: 6, tipe_saldo: 'kredit' },
      { id_owner: 6, tipe_saldo: 'debit' },
      { id_owner: 7, tipe_saldo: 'kredit' },
      { id_owner: 7, tipe_saldo: 'debit' },
      { id_owner: 8, tipe_saldo: 'kredit' },
      { id_owner: 8, tipe_saldo: 'debit' },
      { id_owner: 9, tipe_saldo: 'kredit' },
      { id_owner: 9, tipe_saldo: 'debit' },
    ]

    await Dompet.createMany(data)
  }
}

module.exports = DompetOwnerSeeder
