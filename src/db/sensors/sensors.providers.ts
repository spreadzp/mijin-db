import { SensorSchema } from './shemas/sensor.shema';
import { Connection } from 'mongoose';
require('dotenv').config();


export const sensorsProviders = [
  {
    provide: 'SensorModelToken',
    useFactory: (connection: Connection) => connection.model('Sensor', SensorSchema),
    inject: [process.env.DB_PROVIDER],
  },
];