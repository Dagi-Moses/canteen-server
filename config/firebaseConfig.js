require("dotenv").config();

const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json"); // Replace with the actual path to your service account key file.

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL, // Replace <your-project-id> with your actual project ID.
});

module.exports = admin;
