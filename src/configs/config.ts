import dotenv from "dotenv";

dotenv.config();
interface IConfig {
    PORT: string;
    MONGO_URI: string;
    FRONTEND_URL: string;

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: string;
    JWT_REFRESH_LIFETIME: string;

    JWT_ACTIVATE_SECRET: string;
    JWT_ACTIVATE_LIFETIME: string;
    JWT_RECOVERY_SECRET: string;
    JWT_RECOVERY_LIFETIME: string;

    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
    MANAGER_EMAIL: string;
}

const config: IConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    FRONTEND_URL: process.env.FRONTEND_URL,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME || "10m",
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME || "20m",

    JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,
    JWT_ACTIVATE_LIFETIME: process.env.JWT_ACTIVATE_LIFETIME || "1h",
    JWT_RECOVERY_SECRET: process.env.JWT_RECOVERY_SECRET,
    JWT_RECOVERY_LIFETIME: process.env.JWT_RECOVERY_LIFETIME || "10m",

    SMTP_HOST: process.env.SMTP_HOST || "smtp.ethereal.email",
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM || "AutoRia Clone",
    MANAGER_EMAIL: process.env.MANAGER_EMAIL || "manager@gmail.com",
};

export { config };
