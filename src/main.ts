import express from "express";
import mongoose from "mongoose";

import { config } from "./configs/config.js";
import { authRouter } from "./routers/auth.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

const dbConnection = async () => {
    let dbCon = false;

    while (!dbCon) {
        try {
            console.log("Connecting to DB...");
            await mongoose.connect(config.MONGO_URI);
            dbCon = true;
            console.log("Database connected");
        } catch (e) {
            console.log("Database unavailable, wait 3 seconds", e.message);
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

const start = async () => {
    try {
        await dbConnection();
        app.listen(config.PORT, async () => {
            console.log(`Server listening on http://localhost:${config.PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
