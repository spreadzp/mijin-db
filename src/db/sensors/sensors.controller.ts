import { Sensor } from 'common/models/sensor';
import { Controller, Get, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) { }

  @Post('create')
  async create(@Body() createSensorDto: CreateSensorDto) {
    this.sensorsService.create(createSensorDto);
  }

  @Get('all')
  //async findAll(@Res() res){
  async findAll(): Promise<Sensor[]> {
    const sensors = await this.sensorsService.findAll();
    return sensors;
    //res.status(HttpStatus.OK).json(sensors);
  }
  @Get('**')
  notFoundPage(@Res() res) {
    res.redirect('/');
  }
}