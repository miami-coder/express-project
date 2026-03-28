import { updateCurrenciesCron } from "./update-currencies.cron.js";

export const cronRunner = async () => {
    updateCurrenciesCron.start();
};
