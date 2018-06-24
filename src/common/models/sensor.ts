import { Document } from 'mongoose';
export class Sensor extends Document{
    readonly sensorId: string;
    readonly sensorName: string;
    readonly initiator: boolean;
    readonly value: string;
    readonly time: string;
    readonly ассоuntMijin: string;
}