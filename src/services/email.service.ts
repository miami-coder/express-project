import path from "node:path";

import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer/index.js";
import hbs from "nodemailer-express-handlebars";

import { config } from "../configs/config.js";

interface IEmailOptions extends Options {
    template?: string;
    context?: Record<string, any>;
}

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

    public async sendBrandRequestEmail(
        adminEmail: string,
        context: { brandName: string; userName: string },
    ): Promise<void> {
        try {
            const mailOptions: IEmailOptions = {
                from: config.SMTP_FROM,
                to: adminEmail,
                subject: "New Brand Request",
                template: "brand-request",
                context,
            };

            const info = await this.transporter.sendMail(mailOptions);

            if (config.SMTP_HOST === "smtp.ethereal.email") {
                console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    public async sendBadWordsReport(
        managerEmail: string,
        context: { userName: string; carId: string },
    ): Promise<void> {
        try {
            const mailOptions: IEmailOptions = {
                from: config.SMTP_FROM,
                to: managerEmail,
                subject: "Blocking message (Bad Words content)",
                template: "bad-words",
                context,
            };

            const info = await this.transporter.sendMail(mailOptions);

            if (config.SMTP_HOST === "smtp.ethereal.email") {
                console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export const emailService = new EmailService();
