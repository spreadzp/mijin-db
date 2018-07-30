import { AccountMijinService } from './account.mijin.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [],
    providers: [AccountMijinService],
  })
  export class MijinModule { }