import { Document } from 'mongoose';

export class Account extends Document {
  readonly shipmentsId: string;
  readonly name: string;
  readonly publicKey: string;
}
