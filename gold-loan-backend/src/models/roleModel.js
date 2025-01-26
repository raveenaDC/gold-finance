import { Schema, model } from 'mongoose';

const roleSchema = new Schema(
    {
        roleName: String,
        roleStatus: {
            type: Boolean,
            default: 1,
        },
    },
    { timestamps: true }
);

export default model('role', roleSchema);
