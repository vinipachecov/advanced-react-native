const functions = require('firebase-functions');
const admin = require('firebase-admin');
const createUser =  require('./createUser');
const serviceAccount = require('./serviceAccount.json');
const config = require('./credentials');
const teste = require('./teste');
const requestOneTimePassword = require('./request_OneTimePassword');
const verifyOneTimePassword = require('./verify_one_time_password')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
  });

exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword);
exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword);
