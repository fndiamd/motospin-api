
const Route = use('Route')

// Route Middleware admin
Route.group(() => {
    Route.post('/admin-logout', 'Auth/AdminController.logout')
}).prefix('api/v1/auth').middleware(['auth:admin'])

Route.group(() => {
    Route.post('/admin-login', 'Auth/AdminController.login')
}).prefix('api/v1/auth').middleware(['guest'])
