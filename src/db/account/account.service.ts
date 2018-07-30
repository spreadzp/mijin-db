import { AccountMijinService } from './../../blockchain/account.mijin.service';
import { Account } from 'common/models/account';
import { CreateAccountDto } from './dto/create-account.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sensor } from 'common/models/sensor';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private accountMijinService: AccountMijinService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return await createdAccount.save();
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().exec();
  }

  async createMultisig(nameMultisigPrivate: string, consigners: string[]){
    return await this.accountMijinService.createMultisigAccount(nameMultisigPrivate, consignators);
  }
}
