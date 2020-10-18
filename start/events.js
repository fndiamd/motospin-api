const Event = use('Event')

// Order Service Notification
Event.on('new::orderService', 'OrderService.createdOrderService')
Event.on('notifOutlet::orderService', 'OrderService.incomingOrderService')
Event.on('accept::orderService', 'OrderService.acceptOrderService')
Event.on('decline::orderService', 'OrderService.declineOrderService')
Event.on('cancel::orderService', 'OrderService.cancelOrderService')
Event.on('finish::orderService', 'OrderService.finishOrderService')
Event.on('working::orderService', 'OrderService.workingOrderService')

// Order Produk Notification
Event.on('notifOutlet::orderProduk', 'OrderProduk.incomingOrderProduk')
Event.on('notifOutletCOD::orderProduk', 'OrderProduk.incomingOrderProdukCOD')
Event.on('accept::orderProduk', 'OrderProduk.acceptOrderProduk')
Event.on('sending::orderProduk', 'OrderProduk.sendingOrderProduk')
Event.on('outletCancel::orderProduk', 'OrderProduk.outletCancelOrderProduk')
Event.on('userCancel::orderProduk', 'OrderProduk.userCancelOrderProduk')
Event.on('finish::orderProduk', 'OrderProduk.finishOrderProduk')

// Order Produk Payment Notification
Event.on('pending::paymentProduk', 'PaymentProduk.pendingPaymentProduk')
Event.on('cancel::paymentProduk', 'PaymentProduk.cancelPaymentProduk')
Event.on('settlement::paymentProduk', 'PaymentProduk.settlementPaymentProduk')

// Dompet Owner Notification
Event.on('pending::dompetOwner', 'DompetOwner.pendingPayment')
Event.on('cancel::dompetOwner', 'DompetOwner.cancelPayment')
Event.on('settlement::dompetOwner', 'DompetOwner.settlementPayment')

// User event
Event.on('registered::user', 'User.sendEmail')
Event.on('forgotPassword::user', 'User.forgotPassword')
Event.on('requestCode::user', 'User.requestCode')

// Owner event
Event.on('registered::owner', 'Owner.sendEmail')
Event.on('forgotPassword::owner', 'Owner.forgotPassword')
Event.on('requestCode::owner', 'Owner.requestCode')