const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseConfig.js");

router.post("/", async (req, res) => {
  console.log("Started verifying...");
  const { email, otp, type } = req.body;
  console.log(req.body);

  if (!email || !otp) {
    return res.status(400).send("Email, OTP are required");
  }

  try {
  
    const otpDoc = await admin.firestore().collection("otps").doc(email).get();
    if (!otpDoc.exists) {
      return res.status(400).send("Invalid or expired OTP");
    }

    const { otp: storedOtp, expiresAt } = otpDoc.data();
    if (Date.now() > expiresAt) {
      await admin.firestore().collection("otps").doc(email).delete();
      return res.status(400).send("OTP has expired");
    }
    if (storedOtp !== otp) {
      return res.status(400).send("Invalid OTP");
    }
    await admin.firestore().collection("otps").doc(email).delete();


    if (type === "register") {
  
      return res.status(200).send("Email verified successfully");
    } else {
      try {
       
        const userRecord = await admin.auth().getUserByEmail(email);
        const customToken = await admin
          .auth()
          .createCustomToken(userRecord.uid);
        return res.status(200).json({ customToken });
      } catch (error) {
        console.error("Error generating custom token:", error);
        return res.status(500).send("Error generating custom token");
      }
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).send("Error verifying OTP");
  }
});

module.exports = router;
