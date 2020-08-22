const Event = use('Event')

Event.on('new::orderService', 'OrderService.created')
Event.on('accept::orderService', 'OrderService.accept')
Event.on('decline::orderService', 'OrderService.decline')
Event.on('finish::orderService', 'OrderService.finish')