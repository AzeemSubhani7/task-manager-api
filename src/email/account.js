const sgMail = require('@sendgrid/mail');

const api = process.env.SENDGRID_API_KEY

sgMail.setApiKey(api);

// sgMail.send({
//     to: 'sp18-bcs-098@cuilahore.edu.pk',
//     from: 'sp18-bcs-098@cuilahore.edu.pk',
//     subject: 'sending with sendgrid is xD',
//     text: 'Hello to the future',
//     html: '<h1>Hello to the future</h1>'
// }).then( () => { console.log('Email Send!')})
//     .catch( (e) => { console.log(e);})
const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'sp18-bcs-098@cuilahore.edu.pk',
        subject: 'thanks for joining in',
        text: `Welcome to the app ${name}. Please have a threesome`
    }).then( () => {console.log('email sent')}).catch((e)=> {console.log(e)})
}
const sendCancelationEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'sp18-bcs-098@cuilahore.edu.pk',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}. I hope to see you back sometime soon`
    }).then(()=> {console.log('email sent!')}).catch(e => {console.log(e)})
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}