const Event = use('Event')

// Order Service
Event.on('new::orderService', 'Notification.createdOrderService')
Event.on('accept::orderService', 'Notification.acceptOrderService')
Event.on('decline::orderService', 'Notification.declineOrderService')
Event.on('finish::orderService', 'Notification.finishOrderService')

// Order Produk Payment
Event.on('pending::paymentProduk', 'PaymentProduk.pendingPaymentProduk')
Event.on('cancel::paymentProduk', 'PaymentProduk.cancelPaymentProduk')
Event.on('settlement::paymentProduk', 'PaymentProduk.settlementPaymentProduk')

// Dompet Owner Notification
Event.on('pending::dompetOwner', 'DompetOwner.pendingPayment')
Event.on('cancel::dompetOwner', 'DompetOwner.cancelPayment')
Event.on('settlement::dompetOwner', 'DompetOwner.settlementPayment')

