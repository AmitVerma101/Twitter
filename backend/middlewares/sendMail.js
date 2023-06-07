require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
function sendMail(user){


const msg = {
  to: user.email, // Change to your recipient
  from: 'amitver2000@gmail.com', // Change to your verified sender
  subject: 'Verification for the twitter account',
  
  html: `Your Verification code for twitter is <strong>${user.code}</strong>`,
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

module.exports = {sendMail}