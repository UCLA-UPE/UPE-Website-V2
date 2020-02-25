const nodemailer = require('nodemailer')

module.exports = class Mailer {

  // private members in ES6 use #
  #transporter
  #apiUrl

  constructor(apiUrl) {
    this.#apiUrl = apiUrl
  }

  async init() {
    const testAccount = await nodemailer.createTestAccount() // from ethereal.email
    this.#transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
  }

  async sendEmailVerification(email, verificationString) {
    let info = await this.#transporter.sendMail({
      from: '"UCLA UPE Testbank" <testbank@upe.seas.ucla.edu>',
      to: email,
      subject: 'Confirm Email for UCLA UPE Testbank',
      html: `Hello. Someone registered this email address for an account at the UCLA UPE Testbank. <br />
             If this was you, please click <a href='${this.#apiUrl}/verify-email/${verificationString}'>this link</a>. <br />
             Otherwise, please ignore this email. <br />`,
      // html: '<b>Hello world?</b>'
    })
    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    return true
  }
}
