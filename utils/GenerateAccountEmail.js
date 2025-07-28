require("dotenv").config();

const GeneratedVerifyAccountEmail = (email, code) => {
    const host = process.env.HOST || "http://localhost:3000";
    const verificationLink = `${host}/api/v1/auth/verify-email?code=${code}&email=${email}`;
    return verificationLink;
}

// YOU CAN CHANGE THIS TO YOUR FRONTEND URL
// EXAMPLE: `http://your-frontend-url.com/reset-password?code=${code}&email=${email}`;
const GenerateResetPasswordEmail = (email, code) => {
    const host = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${host}/reset-password-with-code?code=${code}&email=${email}`;
    return resetLink;
}

module.exports = {
    GeneratedVerifyAccountEmail,
    GenerateResetPasswordEmail
};