interface IConfig {
    PORT: number;
    MONGO_URI: string;
}

const config: IConfig = {
    PORT: Number(process.env.PORT),
    MONGO_URI: process.env.MONGO_URI,
};

export { config };
