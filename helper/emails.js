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
    html: `<head>
    <title>Rating Reminder</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
  </head>
  <body style="background-color: #f4f4f5;">
    <table
      cellpadding="0"
      cellspacing="0"
      style="
        width: 100%;
        height: 100%;
        background-color: #f4f4f5;
        text-align: center;
        margin-top: 500px;
      "
    >
      <tbody>
        <tr>
          <td style="text-align: center;">
            <table
              align="center"
              cellpadding="0"
              cellspacing="0"
              id="body"
              style="
                background-color: #fff;
                width: 100%;
                max-width: 680px;
                height: 100%;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="page-center"
                      style="
                        text-align: left;
                        padding-bottom: 88px;
                        width: 100%;
                        padding-left: 120px;
                        padding-right: 120px;
                      "
                    >
                      <tbody>
                        <tr></tr>
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-top: 72px;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #000000;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 48px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 600;
                              letter-spacing: -2.6px;
                              line-height: 52px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                            "
                          >
                            Welcome to Prayer Requset App
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 48px; padding-bottom: 48px;">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%;"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      width: 100%;
                                      height: 1px;
                                      max-height: 1px;
                                      background-color: #d9dbe0;
                                      opacity: 0.81;
                                    "
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 16px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: -0.18px;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            You're receiving this e-mail because you've
                            successfully registered into the App account.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 16px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: -0.18px;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            Sign in to your account, post your prayer requesets
                            and pray for others. Thank You.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding-top: 24px;
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 16px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: -0.18px;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            Please tap the button below to choose a new password.
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a
                              data-click-track-id="37"
                              href="https://prayer-request-app.com/"
                              style="
                                margin-top: 36px;
                                -ms-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                                -webkit-font-smoothing: antialiased;
                                -webkit-text-size-adjust: 100%;
                                color: #ffffff;
                                font-family: 'Postmates Std', 'Helvetica',
                                  -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                  'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                  sans-serif;
                                font-size: 12px;
                                font-smoothing: always;
                                font-style: normal;
                                font-weight: 600;
                                letter-spacing: 0.7px;
                                line-height: 48px;
                                mso-line-height-rule: exactly;
                                text-decoration: none;
                                vertical-align: top;
                                width: 220px;
                                background-color: #00cc99;
                                border-radius: 28px;
                                display: block;
                                text-align: center;
                                text-transform: uppercase;
                              "
                              target="_blank"
                            >
                              Login
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              cellpadding="0"
              cellspacing="0"
              id="footer"
              style="
                background-color: #000;
                width: 100%;
                max-width: 680px;
                height: 100%;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="footer-center"
                      style="
                        text-align: left;
                        width: 100%;
                        padding-left: 120px;
                        padding-right: 120px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-top: 72px;
                              padding-bottom: 24px;
                              width: 100%;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            style="padding-top: 24px; padding-bottom: 48px;"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%;"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      width: 100%;
                                      height: 1px;
                                      max-height: 1px;
                                      background-color: #eaecf2;
                                      opacity: 0.19;
                                    "
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 15px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: 0;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            If you have any questions or concerns, we're here to
                            help. Contact us via our
                            <a
                              data-click-track-id="1053"
                              href="#"
                              style="font-weight: 500; color: #ffffff;"
                              target="_blank"
                              >Help Center</a
                            >.
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 72px;"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  `,
  };

  return await transporter.sendMail(mailOptions);
};

exports.forgotPasswordEmail = async (user, token) => {
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
  const link = `https://prayer-request-app.com/reset-password/?email=${user.email}&token=${token}`;

  const mailOptions = {
    from: "PRAYERREQUESTAPP 📧 <nirmaldavid96@gmail.com>",
    to: user.email,
    subject: "Forgot Password Link",
    text: link,
    html: `<head>
    <title>Rating Reminder</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <meta content="width=device-width" name="viewport">
    
    </head>
    <body style="background-color: #f4f4f5;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
    <tbody><tr>
    <td style="text-align: center;">
    <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
    <tbody><tr>
    <td>
    <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;">
    <tbody><tr>
    
    </tr>
    <tr>
    <td colspan="2" style="padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">Reset your password</td>
    </tr>
    <tr>
    <td style="padding-top: 48px; padding-bottom: 48px;">
    <table cellpadding="0" cellspacing="0" style="width: 100%">
    <tbody><tr>
    <td style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81"></td>
    </tr>
    </tbody></table>
    </td>
    </tr>
    <tr>
    <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                          You're receiving this e-mail because you requested a password reset for your Prayer Request App account.
                                        </td>
    </tr>
    <tr>
    <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                          Please tap the button below to choose a new password.
                                        </td>
    </tr>
    <tr>
    <td>
    <a data-click-track-id="37" href=${link} style="margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #00cc99; border-radius: 28px; display: block; text-align: center; text-transform: uppercase" target="_blank">
                                            Reset Password
                                          </a>
    </td>
    </tr>
    </tbody></table>
    </td>
    </tr>
    </tbody></table>
    <table align="center" cellpadding="0" cellspacing="0" id="footer" style="background-color: #000; width: 100%; max-width: 680px; height: 100%;">
    <tbody><tr>
    <td>
    <table align="center" cellpadding="0" cellspacing="0" class="footer-center" style="text-align: left; width: 100%; padding-left: 120px; padding-right: 120px;">
    <tbody><tr>
    <td colspan="2" style="padding-top: 72px; padding-bottom: 24px; width: 100%;">
    </td>
    </tr>
    <tr>
    <td colspan="2" style="padding-top: 24px; padding-bottom: 48px;">
    <table cellpadding="0" cellspacing="0" style="width: 100%">
    <tbody><tr>
    <td style="width: 100%; height: 1px; max-height: 1px; background-color: #EAECF2; opacity: 0.19"></td>
    </tr>
    </tbody></table>
    </td>
    </tr>
    <tr>
    <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095A2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 15px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: 0; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                              If you have any questions or concerns, we're here to help. Contact us via our <a data-click-track-id="1053" href="#" style="font-weight: 500; color: #ffffff" target="_blank">Help Center</a>.
                                            </td>
    </tr>
    <tr>
    <td style="height: 72px;"></td>
    </tr>
    </tbody></table>
    </td>
    </tr>
    </tbody></table>
    </td>
    </tr>
    </tbody></table>
    
    
    
    </body>`,
  };

  return await transporter.sendMail(mailOptions);
};
