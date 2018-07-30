import { Delivery } from 'common/models/delivery';
import { Controller, Get, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) { }

  @Post('create')
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    this.deliveryService.create(createDeliveryDto);
    console.log('createDeliveryDto :' );
  }

  @Get('all')
  //async findAll(@Res() res){
  async findAll(): Promise<Delivery[]> {
    const deliverys = await this.deliveryService.findAll();
    return deliverys;
    //res.status(HttpStatus.OK).json(sensors);
  }
  @Get('**')
  notFoundPage(@Res() res) {
    res.redirect('/');
  }
}