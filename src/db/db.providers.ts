import * as mongoose from 'mongoose';
require('dotenv').config();

export const databaseProviders = [
    {
        provide: process.env.DB_PROVIDER,
        useFactory: async () => {
            (mongoose as any).Promise = global.Promise;
            return await mongoose.connect('mongodb://localhost:27017/prometeus');
        },
    },
];