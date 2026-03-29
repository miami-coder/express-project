import { CronJob } from "cron";

import { Car } from "../models/car.model.js";
import { exchangeService } from "../services/exchange.service.js";

const handler = async () => {
    try {
        console.log("--- Starting currency update ---");
        const rates = await exchangeService.getRates();
        const cars = await Car.find();

        const bulkOperations = cars.map((car) => {
            const updatedPrices = {
                uah: Math.round(
                    exchangeService.convert(
                        car.price,
                        car.currency,
                        "UAH",
                        rates,
                    ),
                ),
                usd: Math.round(
                    exchangeService.convert(
                        car.price,
                        car.currency,
                        "USD",
                        rates,
                    ),
                ),
                eur: Math.round(
                    exchangeService.convert(
                        car.price,
                        car.currency,
                        "EUR",
                        rates,
                    ),
                ),
            };

            return {
                updateOne: {
                    filter: { _id: car._id },
                    update: {
                        $set: {
                            prices: updatedPrices,
                            exchangeRate: rates[car.currency] || 1,
                        },
                    },
                },
            };
        });

        if (bulkOperations.length > 0) {
            await Car.bulkWrite(bulkOperations);
        }
    } catch (e) {
        console.error("Currency Cron Error:", e.message);
    }
};

export const updateCurrenciesCron = new CronJob("0 0 0 * * *", handler);
