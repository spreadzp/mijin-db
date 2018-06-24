import * as mongoose from 'mongoose';

export const SensorSchema = new mongoose.Schema({
    sensorId: String,
    sensorName: String,
    initiator: Boolean,
    value: String,
    time: String,
    ассоuntMijin: String,
});
