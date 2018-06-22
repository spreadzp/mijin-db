import { Component } from '@nestjs/common';
import {
    PublicAccount, NamespaceHttp, NamespaceId, Account, Deadline, NetworkType,
    RegisterNamespaceTransaction, TransactionHttp, UInt64, Address
} from 'nem2-sdk'; 
require('dotenv').config();


export class NamespaceHelper {
    namespaceHttp: NamespaceHttp;
    privateKey;
    account;
    transactionHttp: TransactionHttp;
    originAccount: Address;

    constructor() {
        this.originAccount = Address.createFromPublicKey(process.env.TOCKEN_DISTRIBUTOR_PUBLIC_KEY, NetworkType.MIJIN_TEST);
        this.namespaceHttp = new NamespaceHttp(process.env.URL);
        this.transactionHttp = new TransactionHttp(process.env.URL);
        this.privateKey = process.env.TOCKEN_DISTRIBUTOR_PRIVATE_KEY as string;
        this.account = Account.createFromPrivateKey(this.privateKey, NetworkType.MIJIN_TEST);
    }

    checkingNamespaceExistence() {
        this.namespaceHttp.getNamespacesFromAccount(this.originAccount).subscribe(
            namespace => console.log(namespace),
            err => console.error(err)
        );
    }

    registerNamespace(duration: number, rootNamespaceName: string, subnamespace?: string) {
        let registerNamespaceTransaction;
        if (subnamespace !== undefined && subnamespace.length > 0) {
            console.log("sub-namespace")
            registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
                Deadline.create(),
                subnamespace,
                rootNamespaceName,
                NetworkType.MIJIN_TEST
            );
        } else {
            console.log(duration.valueOf())
            registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                Deadline.create(),
                rootNamespaceName, // use your own namespace name
                UInt64.fromUint(duration),
                NetworkType.MIJIN_TEST,
            );
        }

        if (registerNamespaceTransaction !== undefined) {
            const signedTransaction = this.account.sign(registerNamespaceTransaction);

            this.transactionHttp.announce(signedTransaction).subscribe(
                x => console.log("transactionHttp.announce", x),
                err => console.error("err- transactionHttp.announce", err)
            );
        }

    }

    registerSubnamespace(duration: number, rootNamespace: string, underNamespace: string) {
        this.registerNamespace(duration, rootNamespace, underNamespace);
    }
}
