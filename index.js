const express = require("express")
require("dotenv").config();
const mongoDBConnection = require("./utils/Connection")
const { fetchVoiceListFromEdge } = require("./services/VoiceService");
const GlobalHandleError = require("./errors/GlobalHandleError")
const UrlHandleError = require("./errors/UrlHandleError");
const app = express();
const PORT = process.env.SERVER_PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const cors = require("cors");

// Routers
const AuthRouter = require("./routes/AuthRouter");
const VoiceRouter = require("./routes/VoiceRouter");
const UserQuotaRouter = require("./routes/UserQuotaRouter");
const UserRouter = require("./routes/UserRouter");
const TTSHistoryRouter = require("./routes/TTSHistoryRouter");

// Connect to MongoDB
mongoDBConnection(MONGODB_URL);

app.use(express.json());
app.use(cors());

// Fetch and save voice list from Edge TTS
fetchVoiceListFromEdge();

// Route
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/voices", VoiceRouter);
app.use("/api/v1/user-quotas", UserQuotaRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/tts-histories", TTSHistoryRouter);

app.use(UrlHandleError); // 404 - Not found
app.use(GlobalHandleError) // 500 - All Error


app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});