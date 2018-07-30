import { Account } from 'common/models/account';
import { Controller, Get, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('create')
  async create(@Body() createAccountDto: CreateAccountDto) {
    this.accountService.create(createAccountDto);
    console.log('createAccountDto :' );
  }

  @Get('all')
  async findAll(): Promise<Account[]> {
    const accounts = await this.accountService.findAll();
    return accounts;
  }

  @Post('create-multisig')
  async createMultisig(@Body() body: any) {
    this.accountService.createMultisig(body.nameMultisigPrivate, body.consigners)
  }
  @Get('**')
  notFoundPage(@Res() res) {
    res.redirect('/');
  }
}