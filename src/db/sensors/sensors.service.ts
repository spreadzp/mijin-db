import { CreateSensorDto } from './dto/create-sensor.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sensor } from 'common/models/sensor';

@Injectable()
export class SensorsService {
  constructor(@InjectModel('Sensor') private readonly sensorModel: Model<Sensor>) {}

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const createdSensor = new this.sensorModel(createSensorDto);
    return await createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return await this.sensorModel.find().exec();
  }
}
