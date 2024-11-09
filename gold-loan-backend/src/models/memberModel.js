import { Schema, model } from 'mongoose';

const memberSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        memberImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
        role: String,
        password: String,
        address: String,
        aadhar: String,
        phone: Number,
        pin: Number,
        city: String,
        landMark: String,
        loginDetails: [{
            loginTime: Date,
            logoutTime: Date
        }],
        isAccess: { type: Boolean, default: false },
        state: String
    },
    { timestamps: true }
);

export default model('member', memberSchema);
