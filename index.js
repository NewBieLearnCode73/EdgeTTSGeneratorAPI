const express = require("express")
const mongoDBConnection = require("./utils/Connection")
const { fetchVoiceListFromEdge } = require("./services/VoiceService");
const GlobalHandleError = require("./errors/GlobalHandleError")
const UrlHandleError = require("./errors/UrlHandleError")
const dotenv = require("dotenv").config()
const app = express()
const PORT = process.env.SERVER_PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const cors = require('cors')

const AuthRouter = require("./routes/AuthRouter")
const VoiceRouter = require("./routes/VoiceRouter");
const UserQuotaRouter = require("./routes/UserQuotaRouter");

mongoDBConnection(MONGODB_URL);

app.use(cors());
app.use(express.json());

fetchVoiceListFromEdge();

// Route
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/voices", VoiceRouter);
app.use("/api/v1/user-quota", UserQuotaRouter);


app.use(UrlHandleError); // 404 - Not found
app.use(GlobalHandleError) // 500 - All Error


app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});