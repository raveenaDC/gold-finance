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
        roleId: [{ type: Schema.Types.ObjectId, ref: 'role' }],
        password: String,
        address: String,
        aadhar: String,
        aadharImage: [{
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        }],
        primaryNumber: String,
        secondaryNumber: String,
        dateOfBirth: Date,
        gender: String,
        upId: String,
        pin: Number,
        city: String,
        joiningDate: Date,
        place: String,
        district: String,
        landMark: String,
        loginDetails: [{
            loginTime: Date,
            logoutTime: Date
        }],
        panCardNumber: String,
        panCardName: String,
        bankUserName: String,
        bankAccount: Number,
        ifsc: String,
        bankName: String,
        passBookImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
        isAccess: { type: Boolean, default: false },
        state: String,
        member_token: String
    },
    { timestamps: true }
);

export default model('member', memberSchema);
