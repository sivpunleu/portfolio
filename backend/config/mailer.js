const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

let transportInstance = null;

const getTransporter = () => {
  const { EMAIL_USER, EMAIL_APP_PASSWORD, MAIL_SERVICE = "gmail" } = process.env;

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    throw new Error(
      "EMAIL_USER and EMAIL_APP_PASSWORD must be configured in .env before sending emails",
    );
  }

  if (!transportInstance) {
    transportInstance = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD,
      },
    });
  }

  return transportInstance;
};

// Compatible with existing transporter.sendMail usage
const transporter = {
  sendMail: async (options) => {
    const activeTransport = getTransporter();
    return await activeTransport.sendMail(options);
  },
  isConfigured: () =>
    Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD),
};

module.exports = transporter;
