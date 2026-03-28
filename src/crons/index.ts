import { updateCurrenciesCron } from "./update-currencies.cron.js";
import {
    resetDailyViewsCron,
    resetMonthlyViewsCron,
    resetWeeklyViewsCron,
} from "./views.cron.js";

export const cronRunner = async () => {
    updateCurrenciesCron.start();
    resetDailyViewsCron.start();
    resetWeeklyViewsCron.start();
    resetMonthlyViewsCron.start();
};
