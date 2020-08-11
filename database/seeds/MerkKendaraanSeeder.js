'use strict'

/*
|--------------------------------------------------------------------------
| MerkKendaraanSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const MerkKendaraan = use('App/Models/MerkKendaraan')

class MerkKendaraanSeeder {
  async run () {
    const data = [
      { merk_kendaraan: "TOYOTA" },
      { merk_kendaraan: "HONDA" },
      { merk_kendaraan: "DAIHATSU" },
      { merk_kendaraan: "SUZUKI" },
      { merk_kendaraan: "NISSAN" },
      { merk_kendaraan: "MITSUBISHI" },
      { merk_kendaraan: "AUDI" },
      { merk_kendaraan: "BMW" },
      { merk_kendaraan: "CHEVROLET" },
      { merk_kendaraan: "DATSUN" },
      { merk_kendaraan: "DFSK" },
      { merk_kendaraan: "HINO" },
      { merk_kendaraan: "HYUNDAI" },
      { merk_kendaraan: "ISUZU" },
      { merk_kendaraan: "JAGUAR" },
      { merk_kendaraan: "JEEP" },
      { merk_kendaraan: "KIA" },
      { merk_kendaraan: "LAND ROVER" },
      { merk_kendaraan: "LEXUS" },
      { merk_kendaraan: "MAZDA" },
      { merk_kendaraan: "MERCEDES BENZ" },
      { merk_kendaraan: "MG" },
      { merk_kendaraan: "MINI" },
      { merk_kendaraan: "PEUGEOT" },
      { merk_kendaraan: "RENAULT" },
      { merk_kendaraan: "TATA" }
    ]

    await MerkKendaraan.createMany(data)
  }
}

module.exports = MerkKendaraanSeeder
