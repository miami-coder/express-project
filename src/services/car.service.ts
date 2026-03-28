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
        const userPrice = carData.price as number;
        const userCurrency = carData.currency as string;

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
            console.log(`User ${user.email} is now a SELLER`);
        }

        return newCar;
    }
}

export const carService = new CarService();
