import { Shipment } from 'common/models/shipment';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ShipmentService {
  constructor(@InjectModel('Shipment') private readonly shipmentModel: Model<Shipment>) {}

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    const createdShipment = new this.shipmentModel(createShipmentDto);
    return await createdShipment.save();
  }

  async findAll(): Promise<Shipment[]> {
    return await this.shipmentModel.find().exec();
  }
}
