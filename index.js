const express = require("express");
const setupRoutes = require("./middleware/routings");
const app = express();
const bodyParser = require("body-parser");
const admin = require("./config/firebaseConfig.js"); 
const cors = require("cors");
const notifyDrivers = require("./routes/notifyDrivers.js");

// Export the function so Firebase can recognize it
exports.notifyDrivers = notifyDrivers.notifyDrivers;
const PORT = process.env.PORT || 3000;

require("dotenv").config();

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.get("/", (req, res) => {
   res.send("Server is running! 🚀");
 });
setupRoutes(app);


app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});


