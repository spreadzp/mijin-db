import * as mongoose from 'mongoose';

export const SensorSchema = new mongoose.Schema({
    sensorId: String,
    sensorName: String,
    publicKey: String,
    ovnerId: String,
});
