import { Schema, model } from 'mongoose';

const roleSchema = new Schema(
    {
        roleName: String,
        roleStatus: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default model('role', roleSchema);
