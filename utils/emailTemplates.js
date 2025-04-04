const adminEmailTemplate = (data) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                </div>
                <div class="content">
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${data.message}</p>
                    <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <div class="footer">
                    <p>This is an automated message from your portfolio website.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const userEmailTemplate = (data) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; }
                .button { display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You for Contacting Me!</h2>
                </div>
                <div class="content">
                    <p>Dear ${data.name},</p>
                    <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
                    <p>Here's a copy of your message:</p>
                    <blockquote style="background-color: #eee; padding: 15px; border-left: 5px solid #4A90E2;">
                        ${data.message}
                    </blockquote>
                    <p>Best regards,</p>
                    <p>Navneet Vishwakarma<br>Full Stack Developer</p>
                    <p>
                        <a href="https://your-portfolio-url.com" class="button">Visit My Portfolio</a>
                    </p>
                </div>
                <div class="footer">
                    <p>This is an automated response. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = { adminEmailTemplate, userEmailTemplate };
