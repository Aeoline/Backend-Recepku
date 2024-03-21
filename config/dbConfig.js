var fire = require("firebase-admin");

var serviceAccount = require("../serviceaccountkey.json");

fire.initializeApp({
  credential: fire.credential.cert(serviceAccount),
});

//export module
module.exports = fire;
