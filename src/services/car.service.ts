import { EAccountType } from "../enums/account-type.enum.js";
import { ECarStatus } from "../enums/car-status.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ICar } from "../interfaces/car.interface.js";
import { User } from "../models/user.model.js";
import { carRepository } from "../repositories/car.repository.js";
import { exchangeService } from "./exchange.service.js";

class CarService {
    public async create(
        sellerId: string,
        carData: Partial<ICar>,
        user: any,
    ): Promise<ICar> {
        if (user.accountType === EAccountType.BASE) {
            const carCount = await carRepository.countByUserId(sellerId);
            if (carCount >= 1) {
                throw new ApiError(
                    "Basic account allows only 1 ad. Buy Premium!",
                    StatusCodesEnum.FORBIDDEN,
                );
            }
        }

        const rates = await exchangeService.getRates();
        const userPrice = Number(carData.price);
        const userCurrency = String(carData.currency).toUpperCase();

        const prices = {
            uah: Math.round(
                exchangeService.convert(userPrice, userCurrency, "UAH", rates),
            ),
            usd: Math.round(
                exchangeService.convert(userPrice, userCurrency, "USD", rates),
            ),
            eur: Math.round(
                exchangeService.convert(userPrice, userCurrency, "EUR", rates),
            ),
        };

        const forbiddenWords = ["матюк1", "матюк2", "капець"];
        const hasBadWords = forbiddenWords.some((word) =>
            carData.description?.toLowerCase().includes(word),
        );

        const status = hasBadWords ? ECarStatus.PENDING : ECarStatus.ACTIVE;

        const newCar = await carRepository.create({
            ...carData,
            _sellerId: sellerId,
            status,
            prices,
            exchangeRate: rates[userCurrency] || 1,
        });

        if (user.role === EUserRole.BUYER) {
            await User.findByIdAndUpdate(sellerId, { role: EUserRole.SELLER });
        }

        return newCar;
    }

    public async update(
        id: string,
        updateData: Partial<ICar>,
    ): Promise<ICar | null> {
        const carDocument = await carRepository.getById(id);

        if (!carDocument) {
            throw new ApiError("Car not found", StatusCodesEnum.NOT_FOUND);
        }

        const currentCar = JSON.parse(JSON.stringify(carDocument));

        if (updateData.price || updateData.currency) {
            const rates = await exchangeService.getRates();

            const price = updateData.price ?? currentCar.price;
            const currency = (
                updateData.currency ?? currentCar.currency
            ).toUpperCase();

            if (price === undefined || !currency) {
                throw new ApiError(
                    "Price or currency missing",
                    StatusCodesEnum.BAD_REQUEST,
                );
            }

            updateData.prices = {
                uah: Math.round(
                    exchangeService.convert(price, currency, "UAH", rates),
                ),
                usd: Math.round(
                    exchangeService.convert(price, currency, "USD", rates),
                ),
                eur: Math.round(
                    exchangeService.convert(price, currency, "EUR", rates),
                ),
            };

            updateData.exchangeRate = rates[currency] || 1;
        }

        return await carRepository.updateById(id, updateData);
    }

    public async delete(id: string): Promise<void> {
        const car = await carRepository.getById(id);
        if (!car) {
            throw new ApiError("Car not found", StatusCodesEnum.NOT_FOUND);
        }
        await carRepository.deleteById(id);
    }
}

export const carService = new CarService();
