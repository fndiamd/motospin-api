const Route = use('Route')

// Route Middleware Owner
Route.group(() => {
    Route.post('/owner-logout', 'Auth/OwnerController.logout')
    Route.post('/owner-verification', 'Auth/OwnerController.verifyAccount')
    Route.post('/owner-request-code', 'Auth/OwnerController.requestCode')
    Route.put('/owner-update', 'Auth/OwnerController.update')
    Route.put('/owner-change-password', 'Auth/OwnerController.updatePassword')
    Route.post('/owner-firebase-token', 'Firebase/TokenOwnerController.store')
    Route.delete('/owner-firebase-token', 'Firebase/TokenOwnerController.delete')
}).prefix('api/v1/auth').middleware(['auth:owner'])

// Route Middleware Guest
Route.group(() => {
    Route.post('/owner-register', 'Auth/OwnerController.register')
    Route.post('/owner-login', 'Auth/OwnerController.login')
    Route.post('/owner-request-password', 'Auth/OwnerController.forgotPassword')
    Route.get('/owner-reset-password/:token', 'Auth/OwnerController.viewChangePassword')
    Route.post('/owner-reset-password/:token', 'Auth/OwnerController.changePassword')
}).prefix('api/v1/auth').middleware(['guest'])