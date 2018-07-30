import { config } from './../../blockchain/config';
//import { AccountHelper } from 'blockchain/account.mijin.service';
require('dotenv').config();

export class SensorAccount {
    //accountHelper: AccountHelper;
    constructor() {
       // this.accountHelper = new AccountHelper();
    }

    sendToMultisig(sensorId: any) {

    }
    
    public createMultisig() {
       /*  let consignatoriesPubKeys = [process.env.SENSOR1_PUB_KEY, process.env.SENSOR2_PUB_KEY, process.env.SENSOR3_PUB_KEY];
        this.accountHelper.createMultisigAccount(consignatoriesPubKeys); */
    }
}
 