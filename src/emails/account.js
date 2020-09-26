const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject:'This is my first mail from Node.js',
        text: `Hello ${name} it is our pleasure to make you happy!`
    })
}

const sendCancelationEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject:'Cancelation email!',
        text: `Hello ${name} we are so sorry for your canceling the account!`
    })
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelationEmail: sendCancelationEmail
}
