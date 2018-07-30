export class CreateShipmentDto {
  readonly shipmentId: string;
  readonly startShipmentTime: string;
  readonly buyerCurrency: string;
  readonly payment: string;
  readonly goodsName: string;
  readonly quantityOfGoods: string;
  readonly endShipmentTime: string;
  readonly buyerPublicKey: string;
  readonly sellerPublicKey: string;
  readonly statusShipment: string;
}
