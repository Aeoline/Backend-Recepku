var fire = require("firebase-admin");

var serviceAccount = require("../db-recepku-firebase-adminsdk-s0rfd-b74bc2e22e.json");

fire.initializeApp({
  credential: fire.credential.cert(serviceAccount)
});

module.exports = fire;