import { Shipment } from 'common/models/shipment';
import { Controller, Get, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentService } from './shipment.service';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) { }

  @Post('create')
  async create(@Body() createShipmentDto: CreateShipmentDto) {
    this.shipmentService.create(createShipmentDto);
    console.log('createShipmentDto :' );
  }

  @Get('all')
  //async findAll(@Res() res){
  async findAll(): Promise<Shipment[]> {
    const shipments = await this.shipmentService.findAll();
    return shipments;
    //res.status(HttpStatus.OK).json(sensors);
  }
  @Get('**')
  notFoundPage(@Res() res) {
    res.redirect('/');
  }
}