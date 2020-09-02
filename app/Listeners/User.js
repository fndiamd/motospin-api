'use strict'

const Mail = use('Mail')

const User = exports = module.exports = {}

User.sendEmail = async (_email) => {
    await Mail.send('email-confirmation', { nama: _email.nama, kodeKonfirmasi: _email.kodeKonfirmasi }, (message) => {
        message.to(_email.penerima).from('support@motospin.com').subject('[Kode Konfirmasi] Account Motospin')
    })
}

User.forgotPassword = async (_email) => {
    console.log(_email)
    await Mail.send('forgot-password', { nama: _email.nama, link: _email.link }, (message) => {
        message.to(_email.penerima).from('support@motospin.com').subject('[Reset Password] Account ' + _email.nama + ' Motospin')
    })
}

User.requestCode = async (_email) => {
    await Mail.send('request-code', { nama: _email.nama, kodeKonfirmasi: _email.kodeKonfirmasi }, (message) => {
        message.to(_email.penerima).from('support@motospin.com').subject('[Kode Konfirmasi] Account Motospin')
    })
}
