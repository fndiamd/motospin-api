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
const Env = use('Env')
class MerkKendaraanSeeder {
  async run() {
    const data = [
      {
        merk_kendaraan: "TOYOTA",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/toyota.png`
      },
      {
        merk_kendaraan: "HONDA",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/honda.png`
      },
      {
        merk_kendaraan: "DAIHATSU",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/daihatsu.png`
      },
      {
        merk_kendaraan: "SUZUKI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/suzuki.png`
      },
      {
        merk_kendaraan: "NISSAN",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/nissan.png`
      },
      {
        merk_kendaraan: "MITSUBISHI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/mitshubishi.png`
      },
      {
        merk_kendaraan: "AUDI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/audi.png`
      },
      {
        merk_kendaraan: "BMW",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/bmw.png`
      },
      {
        merk_kendaraan: "CHEVROLET",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/chevrolet.png`
      },
      {
        merk_kendaraan: "DATSUN",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/datsun.png`
      },
      {
        merk_kendaraan: "DFSK",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/dfsk.png`
      },
      {
        merk_kendaraan: "HINO",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/hino.png`
      },
      {
        merk_kendaraan: "HYUNDAI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/hyundai.png`
      },
      {
        merk_kendaraan: "ISUZU",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/isuzu.png`
      },
      {
        merk_kendaraan: "JAGUAR",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/jaguar.png`
      },
      {
        merk_kendaraan: "JEEP",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/jeep.png`
      },
      {
        merk_kendaraan: "KIA",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/kia.png`
      },
      {
        merk_kendaraan: "LAND ROVER",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/landrover.png`
      },
      {
        merk_kendaraan: "LEXUS",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/lexus.png`
      },
      {
        merk_kendaraan: "MAZDA",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/mazda.png`
      },
      {
        merk_kendaraan: "MERCEDES BENZ",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/mercedesbenz.png`
      },
      {
        merk_kendaraan: "MG",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/mg.png`
      },
      {
        merk_kendaraan: "MINI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/mini.png`
      },
      {
        merk_kendaraan: "PEUGEOT",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/peugeot.png`
      },
      {
        merk_kendaraan: "RENAULT",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/renault.png`
      },
      {
        merk_kendaraan: "TATA",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/tata.png`
      },
      {
        merk_kendaraan: "VOLKSWAGEN",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/volkswagen.png`
      },
      {
        merk_kendaraan: "WULING",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/wuling.png`
      },
      {
        merk_kendaraan: "FERARRI",
        merk_kendaraan_img_path: `${Env.get('APP_URL')}/api/v1/merk-kendaraan/img-url/ferarri.png`
      }
    ]

    await MerkKendaraan.createMany(data)
  }
}

module.exports = MerkKendaraanSeeder
