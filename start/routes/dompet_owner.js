const Route = use('Route')

Route.group(() => {
    Route.get('index', 'DompetOwnerController.index')
    Route.get('kredit', 'DompetOwnerController.getCreditWallet')
    Route.get('debit', 'DompetOwnerController.getDebitWallet')
    Route.post('top-up', 'DompetOwnerController.topUpCredit')
}).prefix('api/v1/dompet-owner').middleware(['auth:owner'])