import dns from "node:dns";

import express from "express";
import mongoose from "mongoose";

import { config } from "./configs/config.js";
import { cronRunner } from "./crons/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { apiRouter } from "./routers/api.router.js";
import { runSeeds } from "./seeds/index.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);

app.use(errorHandler);

app.use(express.static("public"));

process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("unhandledRejection", reason);
    process.exit(1);
});

const dbConnection = async () => {
    let dbCon = false;

    while (!dbCon) {
        try {
            console.log("Connecting to DB...");
            await mongoose.connect(config.MONGO_URI);
            dbCon = true;
            console.log("Database connected");
        } catch (e) {
            console.log(
                "Database unavailable, wait 3 seconds",
                (e as Error).message,
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

const start = async () => {
    try {
        await dbConnection();
        await runSeeds();
        cronRunner();
        app.listen(config.PORT, async () => {
            console.log(`Server listening on http://localhost:${config.PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
