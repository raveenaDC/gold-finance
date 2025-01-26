import { Schema, model, Types } from 'mongoose';

const interestSettingSchema = new Schema(
    {
        settingRate: {
            type: Date,
        },
        goldRate: {
            type: Number,
            default: 0
        },
        companyGoldRate: {
            type: Number,
            default: 0
        },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },
    },
    {
        timestamps: true,
        id: false
    }
);

export default model('interestSettings', interestSettingSchema);
