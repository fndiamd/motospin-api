'use strict'

/*
|--------------------------------------------------------------------------
| JenisServiceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const JenisService = use('App/Models/JenisService')
const Env = use('Env')

class JenisServiceSeeder {
  async run () {
    const data = [
      {
        jenis_service: 'AC',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Ban',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Aki/Accu',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Mesin',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Transmisi & Kopling',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Rem',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Suspensi & Steering',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Oli',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      },
      {
        jenis_service: 'Umum',
        jenis_service_img_path: `${Env.get('APP_URL')}/api/v1/jenis-service/img-url/`,
        id_jenis_mitra: 1
      }
    ]

    await JenisService.createMany(data)
  }
}

module.exports = JenisServiceSeeder
