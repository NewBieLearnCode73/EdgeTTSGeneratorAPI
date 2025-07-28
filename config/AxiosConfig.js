const axios = require("axios");
const HTTP_STATUS_CODE = require("http-status-codes");
const ApiError = require("../utils/ApiError");
require("dotenv").config();

const BrevoAxios = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  },
});


module.exports = BrevoAxios;

