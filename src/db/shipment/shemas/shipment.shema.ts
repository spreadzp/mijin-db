import * as mongoose from 'mongoose';

export const ShipmentSchema = new mongoose.Schema({
    shipmentId: String,
    startShipmentTime: String,
    buyerCurrency: String,
    payment: String,
    goodsName: String,
    quantityOfGoods: String,
    endShipmentTime: String,
    buyerPublicKey: String,
    sellerPublicKey: String,
    statusShipment: String,
});
