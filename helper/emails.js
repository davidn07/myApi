const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const gmailClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

gmailClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

exports.registerEmail = async (email) => {
  const accessToken = await gmailClient.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: "nirmaldavid96@gmail.com",
      clientId: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: "PRAYERREQUESTAPP 📧 <nirmaldavid96@gmail.com>",
    to: email,
    subject: "Welcome to Prayer Request App",
    text: "Welcome to Prayer Request App",
    html: `<h4>Welcome to Prayer Request App</h4><br>
          <p>Praise the Lord,<br>You have successfully registered to the Prayer Request App. Go ahead and login to your account.<br> Post your prayer requests and Prayer for others</p><br>
          <h4>Happy Praying</h4>`,
  };

  return await transporter.sendMail(mailOptions);
};
