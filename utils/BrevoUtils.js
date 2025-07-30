const HTTP_STATUS_CODE = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const BrevoAxios = require("../config/AxiosConfig");
require("dotenv").config();

const BrevoTemplateAccountVerification = (email, verificationLink) => {
  return {
    sender: {
      name: "EdgeTTSGenerator",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Verify EdgeTTSGenerator Account",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 EdgeTTSGenerator</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Text-to-Speech API Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #495057; margin-top: 0;">Verify Your Account</h2>
          
          <p style="color: #6c757d; line-height: 1.6; margin-bottom: 30px;">
            Welcome to EdgeTTSGenerator! To complete your registration and start using our Text-to-Speech service, 
            please click the button below to verify your email address.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 50px; 
                      font-weight: bold; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              ✅ Verify Account
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. 
              If you don't complete this action, your account will be automatically deleted.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-bottom: 0;">
            If you didn't create this account, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #adb5bd; font-size: 12px; text-align: center; margin: 0;">
            © 2025 EdgeTTSGenerator. Powered by Microsoft Edge TTS Engine.
          </p>
        </div>
      </div>
    `,
  };
};

const BrevoTemplatePasswordReset = (email, resetLink) => {
  return {
    sender: {
      name: "EdgeTTSGenerator",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Reset Your EdgeTTSGenerator Password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 EdgeTTSGenerator</h1> 
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Text-to-Speech API Platform</p>
        </div>
        <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #495057; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #6c757d; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password for your EdgeTTSGenerator account.
            If you did not make this request, please ignore this email.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 50px;
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              🔄 Reset Password
            </a>
          </div>
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⚠️ Important:</strong> This reset link will expire in 24 hours.
              If you don't complete this action, your account will be locked.
            </p>
          </div>
          <p style="color: #6c757d; font-size: 14px; margin-bottom: 0;">
            If you did not request a password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          <p style="color: #adb5bd; font-size: 12px; text-align: center; margin: 0;">
            © 2025 EdgeTTSGenerator. Powered by Microsoft Edge TTS Engine.
          </p>
        </div>
      </div>
    `,
  };
};


const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const template = BrevoTemplateAccountVerification(email, verificationLink);
    const response = await BrevoAxios.post("/smtp/email", template);

    console.log("Email sent successfully:", response.data);

    if (response.status === HTTP_STATUS_CODE.StatusCodes.CREATED) {
      return {
        statusCode: HTTP_STATUS_CODE.StatusCodes.CREATED,
        message: "Verification email sent successfully!"
      };
    } else {
      throw new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send verification email.");
    }
  } catch (err) {
    throw new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const template = BrevoTemplatePasswordReset(email, resetLink);
    const response = await BrevoAxios.post("/smtp/email", template);

    console.log("Reset password email sent successfully:", response.data);

    if (response.status === HTTP_STATUS_CODE.StatusCodes.CREATED) {
      return {
        statusCode: HTTP_STATUS_CODE.StatusCodes.CREATED,
        message: "Reset password email sent successfully!"
      };
    } else {
      throw new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send reset password email.");
    }
  } catch (err) {
    throw new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail
};