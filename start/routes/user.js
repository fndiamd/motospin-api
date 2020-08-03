
const Route = use('Route')

// Route Middleware User
Route.group(() => {
    Route.post('/user-logout', 'Auth/UserController.logout')
    Route.post('/user-verification', 'Auth/UserController.verifyAccount')
    Route.post('/user-request-code', 'Auth/UserController.requestCode')
}).prefix('api/v1/auth').middleware(['auth:user'])

// Route Middleware Guest
Route.group(() => {
    Route.post('/user-register', 'Auth/UserController.register')
    Route.post('/user-login', 'Auth/UserController.login')
    Route.post('/user-request-password', 'Auth/UserController.forgotPassword')
    Route.post('/user-reset-password/:token', 'Auth/UserController.changePassword')
}).prefix('api/v1/auth').middleware(['guest'])