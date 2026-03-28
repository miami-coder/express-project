import { CronJob } from "cron";

import { Car } from "../models/car.model.js";

export const resetDailyViewsCron = new CronJob("0 0 * * *", async () => {
    await Car.updateMany({}, { $set: { "viewCount.daily": 0 } });
    console.log("Daily views reset");
});

export const resetWeeklyViewsCron = new CronJob("0 0 * * 1", async () => {
    await Car.updateMany({}, { $set: { "viewCount.weekly": 0 } });
    console.log("Weekly views reset");
});

export const resetMonthlyViewsCron = new CronJob("0 0 1 * *", async () => {
    await Car.updateMany({}, { $set: { "viewCount.monthly": 0 } });
    console.log("Monthly views reset");
});
