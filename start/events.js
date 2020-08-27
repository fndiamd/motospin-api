const Event = use('Event')

Event.on('new::orderService', 'Notification.createdOrderService')
Event.on('accept::orderService', 'Notification.acceptOrderService')
Event.on('decline::orderService', 'Notification.declineOrderService')
Event.on('finish::orderService', 'Notification.finishOrderService')

Event.on('new::orderProduk', 'Notification.createdOrderProduk')

Event.on('request::paymentProduk', 'Notification.requestPaymentProduk')

