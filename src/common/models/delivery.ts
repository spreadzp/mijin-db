import { Document } from 'mongoose';

export class Delivery extends Document {
  readonly shipmentId: string;
  readonly sensorId: string;
  readonly timeSensor: string;
  readonly valueSensor: string;
}