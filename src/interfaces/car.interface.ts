import { ECarStatus } from "../enums/car-status.enum.js";
import { ECurrency } from "../enums/currency.enum.js";
import { IBase } from "./base.interface.js";

interface ICar extends IBase {
    _id: string;
    brand: string;
    model: string;
    year: number;
    description: string;
    price: number;
    currency: ECurrency;

    prices: {
        usd: number;
        eur: number;
        uah: number;
    };
    exchangeRate: number;

    status: ECarStatus;
    editAttempts: number;

    viewCount: {
        total: number;
        daily: number;
        weekly: number;
        monthly: number;
    };

    region: string;
    _sellerId: string;
}

interface ICarQuery {
    page?: string;
    limit?: string;
    brand?: string;
    region?: string;
    status?: ECarStatus;
    search?: string;
    price_min?: string;
    price_max?: string;
}

interface ICarResponse extends Omit<ICar, "viewCount"> {
    viewCount?: ICar["viewCount"] | null;

    stats?: {
        avgPriceUkraine: number;
        avgPriceRegion: number;
    };
}

export { ICar, ICarQuery, ICarResponse };
