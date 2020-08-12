'use strict'

/*
|--------------------------------------------------------------------------
| MitraOutletSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Env = use('Env')
const MitraOutlet = use('App/Models/MitraOutlet')

class MitraOutletSeeder {
  async run () {
    const data = [
      {
        mitra_nama: 'Bengkel Widhia',
        mitra_telp: '+62315938701',
        mitra_alamat: 'Jl. Raya Mulyosari No.159, Kalisari, Kec. Mulyorejo, Kota SBY, Jawa Timur 60113',
        mitra_long: 112.7921264,
        mitra_lat: -7.2771074,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/bengkel-widhia.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '08:00:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel Mobil SJM',
        mitra_telp: '+6285100996112',
        mitra_alamat: 'Jl. Kejawan Putih Tambak IIA No.10.b, Kejawaan Putih Tamba, Kec. Mulyorejo, Kota SBY, Jawa Timur 60112',
        mitra_long: 112.7921264,
        mitra_lat: -7.2771074,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/bengkel-sjm.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '07:30:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Grand Speed Bengkel Mobil',
        mitra_telp: '+6281240550774',
        mitra_alamat: 'Jl. Keputih Timur No.119, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.7947013,
        mitra_lat: -7.2835779,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/grand-speed.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '00:00:00',
        mitra_jam_tutup: '23:59:59',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Iwan Bengkel Mobil',
        mitra_telp: '+6285101423119',
        mitra_alamat: 'Jl. Gebang Putih No.65, Gebang Putih, Kec. Sukolilo, Kota SBY, Jawa Timur 60117',
        mitra_long: 112.7947013,
        mitra_lat: -7.2835779,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/iwan-bengkel.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '09:00:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel Harvest Autocar',
        mitra_telp: '+62818323439',
        mitra_alamat: 'Jl. Keputih Tegal Timur No.88, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.7947013,
        mitra_lat: -7.2835779,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/harvest-car.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '08:30:00',
        mitra_jam_tutup: '18:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel Mobil Aji Motor',
        mitra_telp: '+6281231308146',
        mitra_alamat: 'Jl. Keputih Tegal Timur No.61A, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.8061059,
        mitra_lat: -7.2915745,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/bengkel-aji.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '08:00:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel Mobil Surabaya TOP SEVEN GARAGE',
        mitra_telp: '+6281232977708',
        mitra_alamat: 'Jl. Keputih Tegal Timur No.68, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.8061059,
        mitra_lat: -7.2915745,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/top-seven.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '09:00:00',
        mitra_jam_tutup: '22:30:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel AW',
        mitra_telp: '+623177480439',
        mitra_alamat: 'Jl. Keputih Tegal VI No.104, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.800398,
        mitra_lat: -7.2983917,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/bengkel-aw.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '08:00:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      },
      {
        mitra_nama: 'Bengkel Cak Gatot',
        mitra_telp: '+6285954376065',
        mitra_alamat: 'Jl. Keputih Tegal Timur No.99, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111',
        mitra_long: 112.8003516,
        mitra_lat: -7.3002155,
        mitra_img_path: `${Env.get('APP_URL')}/api/v1/mitra-outlet/img-url/bengkel-gatot.jpg`,
        mitra_satus: 1,
        mitra_jam_buka: '08:00:00',
        mitra_jam_tutup: '17:00:00',
        id_jenis_mitra: 1,
        id_owner: 1
      }
    ]

    await MitraOutlet.createMany(data)
  }
}

module.exports = MitraOutletSeeder
