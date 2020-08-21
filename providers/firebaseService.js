class FirebaseService {
    constructor(Config){
        const FirebaseAdmin = require('firebase-admin')
        const FirebaseConfig = Config.get('services.firebase')

        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert({
                projectId: FirebaseConfig.project_id,
                clientEmail: FirebaseConfig.client_email,
                privateKey: FirebaseConfig.private_key
            }),
            databaseURL: FirebaseConfig.databaseURL
        })
        return FirebaseAdmin
    }
}

module.exports = FirebaseService