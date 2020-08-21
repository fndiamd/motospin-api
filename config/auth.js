'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Authenticator
  |--------------------------------------------------------------------------
  |
  | Authentication is a combination of serializer and scheme with extra
  | config to define on how to authenticate a user.
  |
  | Available Schemes - basic, session, jwt, api
  | Available Serializers - lucid, database
  |
  */
  authenticator: 'jwt',

  /*
  |--------------------------------------------------------------------------
  | Session
  |--------------------------------------------------------------------------
  |
  | Session authenticator makes use of sessions to authenticate a user.
  | Session authentication is always persistent.
  |
  */
  session: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'session',
    uid: 'email',
    password: 'password'
  },

  /*
  |--------------------------------------------------------------------------
  | Basic Auth
  |--------------------------------------------------------------------------
  |
  | The basic auth authenticator uses basic auth header to authenticate a
  | user.
  |
  | NOTE:
  | This scheme is not persistent and users are supposed to pass
  | login credentials on each request.
  |
  */
  basic: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'basic',
    uid: 'email',
    password: 'password'
  },

  /*
  |--------------------------------------------------------------------------
  | Jwt
  |--------------------------------------------------------------------------
  |
  | The jwt authenticator works by passing a jwt token on each HTTP request
  | via HTTP `Authorization` header.
  |
  */
  jwt: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: Env.get('APP_KEY')
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Api
  |--------------------------------------------------------------------------
  |
  | The Api scheme makes use of API personal tokens to authenticate a user.
  |
  */
  api: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'api',
    uid: 'email',
    password: 'password'
  },
  user: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'user_telp',
    password: 'user_password',
    options: {
      secret: `${Env.get('APP_KEY')}-user`,
      expiresIn: 31557600000
    }
  },
  owner: {
    serializer: 'lucid',
    model: 'App/Models/MitraOwner',
    scheme: 'jwt',
    uid: 'owner_telp',
    password: 'owner_password',
    options: {
      secret: `${Env.get('APP_KEY')}-mitra_owner`,
      expiresIn: 31557600000
    }
  },
  pegawai: {
    serializer: 'lucid',
    model: 'App/Models/MitraPegawai',
    scheme: 'jwt',
    uid: 'pegawai_telp',
    password: 'pegawai_password',
    options: {
      secret: `${Env.get('APP_KEY')}-mitra_pegawai`,
      expiresIn: 31557600000
    }
  },
  admin: {
    serializer: 'lucid',
    model: 'App/Models/Admin',
    scheme: 'jwt',
    uid: 'admin_email',
    password: 'admin_password',
    options: {
      secret: `${Env.get('APP_KEY')}-admin`,
      expiresIn: 31557600000
    }
  }

  
}
