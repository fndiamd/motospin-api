
const Route = use('Route')

// Route Middleware User
Route.group(() => {
    Route.post('/user-logout', 'Auth/UserController.logout')
    Route.post('/user-verification', 'Auth/UserController.verifyAccount')
    Route.post('/user-request-code', 'Auth/UserController.requestCode')
    Route.put('/user-update', 'Auth/UserController.update')
    Route.put('/user-change-password', 'Auth/UserController.updatePassword')
    Route.post('/user-firebase-token', 'Firebase/TokenUserController.store')
    Route.delete('/user-firebase-token', 'Firebase/TokenUserController.delete')
}).prefix('api/v1/auth').middleware(['auth:user'])

// Route Middleware Guest
Route.group(() => {
    Route.post('/user-register', 'Auth/UserController.register')
    Route.post('/user-login', 'Auth/UserController.login')
    Route.post('/user-request-password', 'Auth/UserController.forgotPassword')
    Route.get('/user-reset-password/:token', 'Auth/UserController.viewChangePassword')
    Route.post('/user-reset-password/:token', 'Auth/UserController.changePassword')
    Route.get('/user-social-auth/:provider', 'Auth/UserController.redirectToProvider')
    Route.get('/user-authenticated/:provider', 'Auth/UserController.handleProviderCallback')
    Route.get('get-token', 'Firebase/TokenUserController.getToken')
}).prefix('api/v1/auth').middleware(['guest'])