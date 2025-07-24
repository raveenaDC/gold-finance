import { Schema, model, Types } from 'mongoose';

const additionalSettingSchema = new Schema(
    {
        insurance: {
            type: Number,
            default: 0
        },
        processingFee: {
            type: Number,
            default: 0
        },
        packingFee: {
            type: Number,
            default: 0
        },
        firstLetter: {
            type: Number,
            default: 0
        },
        secondLetter: {
            type: Number,
            default: 0
        },
        appraiser: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
        id: false
    }
);

export default model('additionalCharge', additionalSettingSchema);
