const sendOtpRouter = require("../routes/sendOtp.js")
const verifyOtpRouter = require("../routes/verifyOtp.js")


const setupRoutes = (app) => {
  app.use("/send-otp", sendOtpRouter);
  app.use("/verify-otp", verifyOtpRouter);
};

module.exports = setupRoutes;
