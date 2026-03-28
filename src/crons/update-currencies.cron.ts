import { CronJob } from "cron";

import { Car } from "../models/car.model.js";
import { exchangeService } from "../services/exchange.service.js";

const handler = async () => {
    try {
        console.log("--- Starting currency update ---");

        const rates = await exchangeService.getRates();

        const cars = await Car.find();

        for (const car of cars) {
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

            await Car.findByIdAndUpdate(car._id, {
                prices: updatedPrices,
                exchangeRate: rates[car.currency] || 1,
            });
        }

        console.log(`Updated prices for ${cars.length} cars`);
    } catch (e) {
        console.error("Currency Cron Error:", e.message);
    }
};

export const updateCurrenciesCron = new CronJob("0 0 0 * * *", handler);
