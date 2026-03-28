import axios from "axios";

interface IPrivatResponse {
    ccy: string;
    base_ccy: string;
    buy: string;
    sale: string;
}

class ExchangeService {
    private readonly PRIVAT_API =
        "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";

    public async getRates(): Promise<Record<string, number>> {
        try {
            const { data } = await axios.get<IPrivatResponse[]>(
                this.PRIVAT_API,
            );
            const rates: Record<string, number> = { UAH: 1 };
            data.forEach((item) => {
                rates[item.ccy.toUpperCase()] = parseFloat(item.sale);
            });
            return rates;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return { USD: 40, EUR: 43, UAH: 1 };
        }
    }

    public convert(
        amount: number,
        from: string,
        to: string,
        rates: Record<string, number>,
    ): number {
        const fromUpper = from.toUpperCase();
        const toUpper = to.toUpperCase();
        const fromRate = rates[fromUpper] || 1;
        const toRate = rates[toUpper] || 1;

        const amountInUah = fromUpper === "UAH" ? amount : amount * fromRate;
        return toUpper === "UAH" ? amountInUah : amountInUah / toRate;
    }
}

export const exchangeService = new ExchangeService();
