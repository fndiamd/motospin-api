const Event = use('Event')

// Order Service Notification
Event.on('new::orderService', 'Notification.createdOrderService')
Event.on('accept::orderService', 'Notification.acceptOrderService')
Event.on('decline::orderService', 'Notification.declineOrderService')
Event.on('finish::orderService', 'Notification.finishOrderService')

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