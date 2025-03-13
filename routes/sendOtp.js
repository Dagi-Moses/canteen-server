const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const admin = require("../config/firebaseConfig.js"); 

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

router.post("/", async (req, res) => {
   console.log("function called");
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email credentials in environment variables");
    return res.status(500).json({ error: "Email service misconfiguration" });
  }
  const otp = generateOtp();
  console.log("Generated OTP:", otp);


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Bypass strict SSL checking
      minVersion: "TLSv1.2", 
    },
  });

  const mailOptions = {
    from: `"CANTEEN APP" <${process.env.EMAIL_USER}>`,

    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };


  try {
    await transporter.sendMail(mailOptions);

    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.firestore().collection("otps").doc(email).set({
      otp,
      expiresAt: expirationTime,
    });

    res.status(200).send("OTP sent");
  } catch (error) {
    console.error("Error sending OTP:", error);
   res.status(500).json({ error: "Error sending OTP", details: error.message });

  }
});


module.exports = router;
