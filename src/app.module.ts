import { SensorsModule } from './db/sensors/sensors.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mijin-arduino'),
    SensorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): MiddlewaresConsumer | void {
    consumer.apply([LoggerMiddleware]).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
