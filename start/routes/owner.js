const Route = use('Route')

// Route Middleware Owner
Route.group(() => {
    Route.post('/owner-logout', 'Auth/OwnerController.logout')
    Route.post('/owner-verification', 'Auth/OwnerController.verifyAccount')
    Route.post('/owner-request-code', 'Auth/OwnerController.requestCode')
}).prefix('api/v1/auth').middleware(['auth:owner'])

// Route Middleware Guest
Route.group(() => {
    Route.post('/owner-register', 'Auth/OwnerController.register')
    Route.post('/owner-login', 'Auth/OwnerController.login')
    Route.post('/owner-request-password', 'Auth/OwnerController.forgotPassword')
    Route.post('/owner-reset-password/:token', 'Auth/OwnerController.changePassword')
}).prefix('api/v1/auth').middleware(['guest'])