import { SensorSchema } from './shemas/sensor.shema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sensor', schema: SensorSchema }])],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule { }
