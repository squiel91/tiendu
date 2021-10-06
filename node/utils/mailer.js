const nodemailer = require('nodemailer')
const env = require('./env')
const theme = require('../email-templates/email-theme')

module.exports = (to, subject, body) => {
  if (env.SEND_EMAIL?.toUpperCase() !== 'TRUE') return

  const transporter = nodemailer.createTransport({
    service: env.EMAIL_PROVIDER,
    auth: {
      user: env.SENDING_EMAIL,
      pass: env.SENDING_EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const mailOptions = {
    from: `"${PREFERENCES.storeName}" <${env.SENDING_EMAIL}>`,
    to: to,
    subject: subject,
    html: theme.head() + body + theme.tail()
  }

  return transporter.sendMail(mailOptions)
}
