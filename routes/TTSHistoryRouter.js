const express = require("express")
const TTSHistoryRouter = express.Router();

const TTSHistoryController = require("../controllers/TTSHistoryController");

TTSHistoryRouter.get("/", TTSHistoryController.getAllHistory);
TTSHistoryRouter.get("/username/:username", TTSHistoryController.getHistoryByUsername);
TTSHistoryRouter.get("/filename/:filename", TTSHistoryController.getHistoryByFilename);


module.exports = TTSHistoryRouter