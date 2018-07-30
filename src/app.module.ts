import { MijinModule } from './blockchain/mijin.module';
import { ShipmentModule } from 'db/shipment/shipment.module';
import { DeliveryModule } from 'db/delivery/delivery.module';
import { AccountModule } from 'db/account/account.module';
import { SensorModule } from 'db/sensor/sensor.module';
import { LoggerMiddleware } from 'common/middlewares/logger.middleware';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    SensorModule, AccountModule, DeliveryModule,
    ShipmentModule, MijinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply([LoggerMiddleware]).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
