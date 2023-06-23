import nodemiler from 'nodemailer'

const sendEmail = async (options) => {
    const testAccount = await nodemiler.createTestAccount()
    const transporter = nodemiler.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        }
    });

    const message = {
      from :`${process.env.FROM_NAME} <${testAccount.user}>`,
      to:options.email,
      subject:options.subject,
      text:options.message
    }
    const info = await transporter.sendMail(message)
    
    console.log(`Preview URL: ${nodemiler.getTestMessageUrl(info)}`)
}

export default sendEmail;