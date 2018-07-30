import { Document } from 'mongoose';
export class Sensor extends Document{
    readonly sensorId: string;
    readonly sensorName: string;
    readonly publicKey: string;
    readonly ovnerId: string;
}
