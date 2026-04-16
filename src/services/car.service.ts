import { config } from "../configs/config.js";
import { FORBIDDEN_WORDS } from "../constants/forbidden-words.constant.js";
import { EAccountType } from "../enums/account-type.enum.js";
import { ECarStatus } from "../enums/car-status.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ICar, ICarQuery, ICarResponse } from "../interfaces/car.interface.js";
import { IRole } from "../interfaces/role.interface.js";
import { IUser } from "../interfaces/user.interface.js";
import { User } from "../models/user.model.js";
import { brandRepository } from "../repositories/brand.repository.js";
import { carRepository } from "../repositories/car.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { emailService } from "./email.service.js";
import { exchangeService } from "./exchange.service.js";
import { fileService } from "./file.service.js";

class CarService {
    public async getAll(query: ICarQuery): Promise<[ICar[], number]> {
        return await carRepository.getAll(query);
    }

    public async getById(id: string, user: IUser): Promise<ICarResponse> {
        const car = await carRepository.getById(id);

        if (!car) {
            throw new ApiError("Car not found", StatusCodesEnum.NOT_FOUND);
        }

        const carResponse: ICarResponse = car.toObject() as ICarResponse;

        if (user.accountType === EAccountType.PREMIUM) {
            const stats = await carRepository.getCarStats(
                car.brand,
                car.model,
                car.region,
            );
            carResponse.stats = stats;
        } else {
            carResponse.viewCount = null;
        }

        return carResponse;
    }

    public async updateStatus(id: string, status: ECarStatus): Promise<ICar> {
        const updatedCar = await carRepository.updateStatus(id, status);

        if (!updatedCar) {
            throw new ApiError(
                "Car not found or status not updated",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return updatedCar;
    }

    public async create(
        sellerId: string,
        carData: Partial<ICar>,
        user: IUser,
        files?: Express.Multer.File[],
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

        const images: string[] = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const filePath = await fileService.saveFile(file, "cars");
                images.push(filePath);
            }
        }

        const brandFromDb = await brandRepository.getByName(
            carData.brand as string,
        );

        if (!brandFromDb) {
            throw new ApiError(
                `The brand "${carData.brand}" is not in the system. Please notify the administrator to add it.`,
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const isModelValid = brandFromDb.models.includes(
            carData.model as string,
        );
        if (!isModelValid) {
            throw new ApiError(
                `Brand ${carData.brand} does not have model ${carData.model}. Please select an existing one or contact support.`,
                StatusCodesEnum.BAD_REQUEST,
            );
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

        const hasBadWords = FORBIDDEN_WORDS.some((word) =>
            carData.description?.toLowerCase().includes(word),
        );

        const status = hasBadWords ? ECarStatus.PENDING : ECarStatus.ACTIVE;
        const editAttempts = hasBadWords ? 1 : 0;

        const newCar = await carRepository.create({
            ...carData,
            _sellerId: sellerId,
            images: images,
            status: status,
            editAttempts: editAttempts,
            prices: prices,
            exchangeRate: rates[userCurrency] || 1,
            viewCount: { total: 0, daily: 0, weekly: 0, monthly: 0 },
        } as ICar);

        if ((user.role as IRole).name === "buyer") {
            const sellerRole = await roleRepository.getByName("seller");
            if (sellerRole) {
                await User.findByIdAndUpdate(sellerId, {
                    role: sellerRole._id,
                });
            }
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

        const currentCar = carDocument.toObject();

        if (updateData.description) {
            const hasBadWords = FORBIDDEN_WORDS.some((word) =>
                updateData.description?.toLowerCase().includes(word),
            );

            if (hasBadWords) {
                const newAttempts = (currentCar.editAttempts || 0) + 1;

                if (newAttempts >= 3) {
                    updateData.status = ECarStatus.BLOCKED;
                    updateData.editAttempts = newAttempts;

                    await carRepository.updateById(id, updateData);
                    const seller = carDocument._sellerId as any;
                    await emailService.sendBadWordsReport(
                        config.MANAGER_EMAIL,
                        {
                            userName: seller?.name || "Unknown User",
                            carId: id,
                        },
                    );
                    throw new ApiError(
                        "Ad blocked: 3 failed attempts to edit text.",
                        StatusCodesEnum.FORBIDDEN,
                    );
                }

                await carRepository.updateById(id, {
                    editAttempts: newAttempts,
                });
                throw new ApiError(
                    `Profanity found! Attempt ${newAttempts} out of 3.`,
                    StatusCodesEnum.BAD_REQUEST,
                );
            }

            updateData.status = ECarStatus.ACTIVE;
        }

        if (updateData.price || updateData.currency) {
            const rates = await exchangeService.getRates();

            const price = updateData.price ?? currentCar.price;
            const currency = (
                updateData.currency ?? currentCar.currency
            ).toUpperCase();

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
