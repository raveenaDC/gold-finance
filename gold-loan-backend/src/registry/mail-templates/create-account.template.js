const backendUrl = process.env.BACKEND_URL;
/**
 * create account template
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @returns {String}
 */

export const createAccountTemplate = (
    name = '',
    email = '',
    password = '',
    loginUrl = ''
) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Account</title>
        <style>
            /* Fallback for clients that do not support media queries */
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                    padding: 10px !important;
                }

                .button {
                    width: 100% !important;
                    text-align: center !important;
                }
            }
        </style>
    </head>
    <body>
        <div id="wrapper" style="background-color:#ececec; padding: 70px 0; width: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                style="max-width:600px; margin:0 auto; background-color:#ffffff; box-shadow:0 1px 4px rgba(0,0,0,0.1); border-radius:8px; overflow:hidden;">
                <tbody>
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="padding: 0px; background-color:#f5f5f5;">
                            <img src="C:/Users/admin/Downloads/logo2.png" alt="Company Logo" width="146"
                                style="display:block; border:0;" />
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 40px 35px 30px 35px;">
                            <h3 style="text-transform: uppercase; color: #FF2323; font-size: 20px; font-family: 'Open Sans', sans-serif; font-weight: 600; margin: 0 0 20px 0;">
                                Hi ${name},
                            </h3>
                            <p style="color: #242a38; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; margin: 0 0 20px 0;">
                                Welcome to our service! Please use the following details to log in to your account:
                            </p>
                            <p style="color: #242a38; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; margin: 0 0 20px 0;">
                                <strong>Email:</strong> ${email}<br>
                                <strong>Password:</strong> ${password}
                            </p>
                            <p style="color: #242a38; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; margin: 0 0 30px 0;">
                                We're thrilled to have you on board and look forward to working with you! Click the button
                                below to access the login page.
                            </p>
                            <div class="button" style="text-align: center;">
                                <a href="${loginUrl}"
                                    style="background-color:#2F2F2F; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:25px; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size:16px; display:inline-block;">
                                    Login
                                </a>
                            </div>
                            <p style="color: #939393; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; margin: 30px 0 0 0;">
                                This email and any attachments are confidential and may also be privileged. If you are not
                                the intended recipient, please delete all copies and notify the sender immediately.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="padding: 20px; background-color:#f5f5f5;">
                            <p style="color: #939393; font-family: 'Rubik', Helvetica, Arial, sans-serif; font-size: 12px; margin: 0;">
                                © 2024 Your Company. All rights reserved.
                                <a href="#" style="color: #939393; text-decoration: underline;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    </html>`;
};

