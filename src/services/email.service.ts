import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { config } from "../configs/config.js";

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASS,
            },
        });

        const viewPath = path.resolve("src", "templates", "views");

        this.transporter.use(
            "compile",
            hbs({
                viewEngine: {
                    extName: ".hbs",
                    partialsDir: viewPath,
                    layoutsDir: undefined,
                    defaultLayout: undefined,
                } as any,
                viewPath,
                extName: ".hbs",
            }),
        );
    }

    public async sendBadWordsReport(
        managerEmail: string,
        context: { userName: string; carId: string },
    ) {
        const info = await this.transporter.sendMail({
            from: config.SMTP_FROM,
            to: managerEmail,
            subject: "Blocking message (Bad Words content)",
            template: "bad-words",
            context,
        });

        if (config.SMTP_HOST === "smtp.ethereal.email") {
            console.log(
                `Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
            );
        }
    }
}

export const emailService = new EmailService();
