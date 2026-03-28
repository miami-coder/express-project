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
                rates[item.ccy] = parseFloat(item.sale);
            });

            return rates;
        } catch (e) {
            console.error(
                "PrivatBank's mistake, we are returning default rates",
                e,
            );
            return { USD: 40, EUR: 43, UAH: 1 };
        }
    }

    public convert(
        amount: number,
        from: string,
        to: string,
        rates: Record<string, number>,
    ): number {
        const amountInUah = from === "UAH" ? amount : amount * rates[from];
        return to === "UAH" ? amountInUah : amountInUah / rates[to];
    }
}

export const exchangeService = new ExchangeService();
