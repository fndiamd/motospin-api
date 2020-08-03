const Route = use('Route')

// Route Middleware Pegawai
Route.group(() => {
    Route.post('/pegawai-logout', 'Auth/PegawaiController.logout')
    Route.post('/pegawai-verification', 'Auth/PegawaiController.verifyAccount')
    Route.post('/pegawai-request-code', 'Auth/PegawaiController.requestCode')
}).prefix('api/v1/auth').middleware(['auth:pegawai'])

// Route Middleware Guest
Route.group(() => {
    Route.post('/pegawai-register', 'Auth/PegawaiController.register')
    Route.post('/pegawai-login', 'Auth/PegawaiController.login')
    Route.post('/pegawai-request-password', 'Auth/PegawaiController.forgotPassword')
    Route.post('/pegawai-reset-password/:token', 'Auth/PegawaiController.changePassword')
}).prefix('api/v1/auth').middleware(['guest'])