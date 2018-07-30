import { Component } from '@nestjs/common';
import {
    Address, Deadline, XEM, NetworkType,
    PlainMessage, TransferTransaction, TransactionHttp,
    Account, RegisterNamespaceTransaction, Mosaic,
    UInt64, MosaicId, PublicAccount, AggregateTransaction, LockFundsTransaction,
    Listener, CosignatureTransaction, AccountHttp, AggregateTransactionCosignature,
} from 'nem2-sdk';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { TransactionRoutesApi, ApiClient } from 'nem2-library';
import * as dotenv from 'dotenv';
dotenv.config();

export class TransactionHelper {
    transactionHttp: TransactionHttp;
    privateKey = process.env.PRIV_KEY as string;
    account: Account;
    accountHttp: AccountHttp;
    listener: Listener;
    transactionRoutesApi: TransactionRoutesApi;
    registerNamespaceTransaction: RegisterNamespaceTransaction;
    apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
        this.apiClient.basePath = process.env.URL;
        this.transactionRoutesApi = new TransactionRoutesApi(this.apiClient);
        this.listener = new Listener(process.env.URL);
        this.transactionHttp = new TransactionHttp(process.env.URL);
        this.accountHttp = new AccountHttp(process.env.URL);
        this.account = Account.createFromPrivateKey(this.privateKey, NetworkType.MIJIN_TEST);
    }

    createTransferTransaction() {
        const recipientAddress = process.env.RECIPIENT_ADDRESS;

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(recipientAddress),
            [XEM.createRelative(10)],
            PlainMessage.create('Welcome To NEM'),
            NetworkType.MIJIN_TEST,
        );
    }

    sendMosaic() {
        const recipientAddress = process.env.RECIPIENT_ADDRESS;
        const signer = PublicAccount.createFromPublicKey(process.env.PUB_KEY, NetworkType.MIJIN_TEST);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(recipientAddress),
            [new Mosaic(new MosaicId('tokenbusiness1:nem-token11'), UInt64.fromUint(5555))],
            PlainMessage.create('send 55555 nem-token11'),
            NetworkType.MIJIN_TEST,
        );

        this.sendSignedTransaction(transferTransaction);
    }

    sendSignedTransaction(transaction: any) {
        const signedTransaction = this.account.sign(transaction);
        this.anounce(signedTransaction);
    }

    sendAtomicSwap(numberTickets: number, mosaicName: string, priceTicket: number) {
        global.console.log('mosaicName :', mosaicName);
        // Replace with private key
        const alicePrivateKey = process.env.PRIV_KEY;
        // Replace with public key
        const ticketDistributorPublicKey = process.env.TOCKEN_DISTRIBUTOR_PUBLIC_KEY;

        const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.MIJIN_TEST);
        const ticketDistributorPublicAccount = PublicAccount.createFromPublicKey(ticketDistributorPublicKey, NetworkType.MIJIN_TEST);

        const aliceToTicketDistributorTx = TransferTransaction.create(
            Deadline.create(),
            ticketDistributorPublicAccount.address,
            [XEM.createRelative(priceTicket)],
            PlainMessage.create('send 10 nem:xem to distributor'),
            NetworkType.MIJIN_TEST,
        );
        const message = `send ${numberTickets}${mosaicName} to alice`;
        const ticketDistributorToAliceTx = TransferTransaction.create(
            Deadline.create(),
            aliceAccount.address,
            [new Mosaic(new MosaicId(mosaicName), UInt64.fromUint(numberTickets))],
            PlainMessage.create(message),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(),
            [
                aliceToTicketDistributorTx.toAggregate(aliceAccount.publicAccount),
                ticketDistributorToAliceTx.toAggregate(ticketDistributorPublicAccount),
            ],
            NetworkType.MIJIN_TEST);

        const signedTransaction = aliceAccount.sign(aggregateTransaction);
        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(),
            XEM.createRelative(10),
            UInt64.fromUint(480),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const lockFundsTransactionSigned = aliceAccount.sign(lockFundsTransaction);
        const transactionHttp = new TransactionHttp(process.env.URL);

        // announce signed transaction
        const listener = new Listener(process.env.URL);
        this.anounce(lockFundsTransactionSigned);

        listener.open().then(() => {

            transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log('announce', x),
                err => global.console.error(err));

            listener.confirmed(aliceAccount.address)
                .filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash)
                .flatMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
                .subscribe(announcedAggregateBonded => {
                    console.log('announcedAggregateBonded', announcedAggregateBonded)
                    this.confirmDistributor();
                },
                    err => console.error(err));
        });
    }

    prepayBuyer() {
        // Replace with private key
        const buyerPrivateKey = process.env.BUYER_PRIV_KEY;
        // Replace with public key
        const sellerPublicKey = process.env.MULTISIG_PUB_KEY;

        const buyerAccount = Account.createFromPrivateKey(buyerPrivateKey, NetworkType.MIJIN_TEST);
        const sellerMultisigAccount = PublicAccount.createFromPublicKey(sellerPublicKey, NetworkType.MIJIN_TEST);

        const buyerToSellerTx = TransferTransaction.create(
            Deadline.create(),
            sellerMultisigAccount.address,
            [XEM.createRelative(3)],
            PlainMessage.create('send 3 nem:xem to seller'),
            NetworkType.MIJIN_TEST,
        );
        const message = `send ${1}${process.env.NAMESPACE_MOSAIC} to buyer`;

        const sellerToBuyerTx = TransferTransaction.create(
            Deadline.create(),
            buyerAccount.address,
            [XEM.createRelative(1)],
            //[new Mosaic(new MosaicId(process.env.NAMESPACE_MOSAIC), UInt64.fromUint(1))],
            PlainMessage.create(message),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(),
            [
                buyerToSellerTx.toAggregate(buyerAccount.publicAccount),
                sellerToBuyerTx.toAggregate(sellerMultisigAccount),
            ],
            NetworkType.MIJIN_TEST);

        const signedTransaction = buyerAccount.sign(aggregateTransaction);
        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(),
            XEM.createRelative(10),
            UInt64.fromUint(480),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const lockFundsTransactionSigned = buyerAccount.sign(lockFundsTransaction);
        const transactionHttp = new TransactionHttp(process.env.URL);

        // announce signed transaction
        const listener = new Listener(process.env.URL);
        this.anounce(lockFundsTransactionSigned);

        listener.open().then(() => {

            transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log("announce", x),
                err => console.error(err));

            listener.confirmed(buyerAccount.address)
                .filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash)
                .flatMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
                .subscribe(announcedAggregateBonded => {
                    console.log("announcedAggregateBonded", announcedAggregateBonded)

                },
                    err => console.error(err));
        });
    }

    cosignAggregateBondedTransaction(transaction: AggregateTransaction, ticketDistributorAccount: Account) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);
        return ticketDistributorAccount.signCosignatureTransaction(cosignatureTransaction);
    }

    confirmDistributor() {
        const ticketDistributorAccount = Account.createFromPrivateKey(process.env.TOCKEN_DISTRIBUTOR_PRIVATE_KEY, NetworkType.MIJIN_TEST);

        const accountHttp = new AccountHttp(process.env.URL);
        const transactionHttp = new TransactionHttp(process.env.URL);

        accountHttp.aggregateBondedTransactions(ticketDistributorAccount.publicAccount)
            .flatMap((_) => _)
            .filter((_) => !_.signedByAccount(ticketDistributorAccount.publicAccount))
            .map(transaction => { 
                return this.cosignAggregateBondedTransaction(transaction, ticketDistributorAccount)
            })
            .flatMap(cosignatureSignedTransaction => {// console.log('cosignatureSignedTransaction :', cosignatureSignedTransaction);
                return transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction)
            }
            )
            .subscribe(announcedTransaction => console.log(announcedTransaction),
                err => console.error(err));
    }

    confirmMultisig(cosignerPrivateKey: string) {
        const consignerAccount = Account.createFromPrivateKey(cosignerPrivateKey, NetworkType.MIJIN_TEST);
        const multisigAccount = Account.createFromPrivateKey(process.env.MULTI_PRIV_KEY, NetworkType.MIJIN_TEST);

        this.accountHttp.aggregateBondedTransactions(multisigAccount.publicAccount)
            .flatMap((_) => _)
            .filter((_) => !_.signedByAccount(consignerAccount.publicAccount))
            .map(transaction => this.cosignAggregateBondedTransaction(transaction, consignerAccount))
            .flatMap(cosignatureSignedTransaction => this.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction))
            .subscribe(announcedTransaction => console.log(announcedTransaction),
                err => console.error(err));
    }

    initMultisigTransaction() {
        const cosignatoryPrivateKey = process.env.SENSOR1_PRIV_KEY;

        // Replace with the multisig public key
        const multisigAccountPublicKey = process.env.MULTISIG_PUB_KEY;

        // Replace with recipient address
        const recipientAddress = process.env.BUYER_ADDRESS;

        const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

        const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, NetworkType.MIJIN_TEST);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(recipientAddress),
            [XEM.createRelative(25)],
            PlainMessage.create('sending 25 nem:xem'),
            NetworkType.MIJIN_TEST,
        );
        const Account2 = PublicAccount.createFromPublicKey(process.env.SENSOR2_PUB_KEY, NetworkType.MIJIN_TEST);
        const Account3 = PublicAccount.createFromPublicKey(process.env.SENSOR3_PUB_KEY, NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [
                transferTransaction.toAggregate(multisigAccount),
            ],
            NetworkType.MIJIN_TEST,
            [new AggregateTransactionCosignature('', Account2), new AggregateTransactionCosignature('', Account3)]
        );

        //Signing the aggregate transaction
        const signedTransaction = cosignatoryAccount.sign(aggregateTransaction);

        //Creating the lock funds transaction and announce it

        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(),
            XEM.createRelative(10),
            UInt64.fromUint(480),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const lockFundsTransactionSigned = cosignatoryAccount.sign(lockFundsTransaction);

        this.listener.open().then(() => {

            this.transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log(x),
                err => console.error(err));

            this.listener.confirmed(cosignatoryAccount.address)
                .filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash)
                .flatMap(ignored => {
                    return this.transactionHttp.announceAggregateBonded(signedTransaction)
                }
                )
                .subscribe(announcedAggregateBonded => {
                    console.log(announcedAggregateBonded)

                },
                    err => console.error(err));
        });
    }

    initMultisigTransaction1() {
        const cosignatoryPrivateKey = process.env.SENSOR1_PRIV_KEY;

        // Replace with the multisig public key
        const multisigAccountPublicKey = process.env.MULTISIG_PUB_KEY;

        // Replace with recipient address
        const recipientAddress = process.env.BUYER_ADDRESS;

        const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

        const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, NetworkType.MIJIN_TEST);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(recipientAddress),
            [XEM.createRelative(25)],
            PlainMessage.create('sending 25 nem:xem'),
            NetworkType.MIJIN_TEST,
        );
        const Account2 = PublicAccount.createFromPublicKey(process.env.SENSOR2_PUB_KEY, NetworkType.MIJIN_TEST);
        const Account3 = PublicAccount.createFromPublicKey(process.env.SENSOR3_PUB_KEY, NetworkType.MIJIN_TEST);
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [
                transferTransaction.toAggregate(multisigAccount),
            ],
            NetworkType.MIJIN_TEST,
            [new AggregateTransactionCosignature('', Account2), new AggregateTransactionCosignature('', Account3)]
        );

        //Signing the aggregate transaction
        const signedTransaction = cosignatoryAccount.sign(aggregateTransaction);

        //Creating the lock funds transaction and announce it

        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(),
            XEM.createRelative(10),
            UInt64.fromUint(480),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const lockFundsTransactionSigned = cosignatoryAccount.sign(lockFundsTransaction);

        this.listener.open().then(() => {

            this.transactionHttp.announce(lockFundsTransactionSigned).subscribe(x => console.log(x),
                err => console.error(err));

            this.listener.confirmed(cosignatoryAccount.address)
                .filter((transaction) => transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash)
                .flatMap(ignored => {
                    return this.transactionHttp.announceAggregateBonded(signedTransaction)
                }
                )
                .subscribe(announcedAggregateBonded => {
                    console.log(announcedAggregateBonded)

                },
                    err => console.error(err));
        });
    }

    anounce(signedTransaction: any) {
        const transactionHttp = new TransactionHttp(process.env.URL);

        // announce signed transaction

        transactionHttp.announce(signedTransaction).subscribe(
            x => console.log(x),
            err => console.error(err));
    }
}
