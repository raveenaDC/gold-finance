import { Schema, model } from 'mongoose';

const basicPlanSettingSchema = new Schema(
    {
        planName: {
            type: String,
        },
        interestPlan: {
            type: String
        },
        interestRate: {
            type: Number,
            default: 0
        },
        minimumDays: {
            type: Number,
            default: 5
        },
        minimumAmount: {
            type: Number,
            default: 0
        },
        interestType: {
            type: String,
            default: 0
        },
    },
    {
        timestamps: true,
        id: false
    }
);

export default model('basicPlan', basicPlanSettingSchema);
