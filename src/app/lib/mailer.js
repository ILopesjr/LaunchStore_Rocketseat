const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c208b33c4bd9b4",
    pass: "cb02bf585f6c6b"
  }
});
