const admin = require("firebase-admin");
const fs = require("fs");

// Path to the service account key in Render
const serviceAccountPath = "/etc/secrets/serviceAccountKey.json";
let serviceAccount;

if (fs.existsSync(serviceAccountPath)) {
  // Read and parse the secret file in Render
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
} else {
  // Load from local file for development
  try {
    serviceAccount = require("../serviceAccountKey.json");
  } catch (error) {
    console.error(
      "❌ No service account key found. Make sure it's in Render secrets or locally."
    );
    process.exit(1);
  }
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in your environment
});

module.exports = admin;
