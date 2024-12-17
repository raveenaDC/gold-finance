import { Schema, model } from 'mongoose';
import { stringify } from 'uuid';

const customerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        address: String,
        place: String,
        district: String,
        state: String,
        pin: Number,
        nearBy: String,
        primaryNumber: String,
        city: String,
        secondaryNumber: String,
        aadhar: String,
        dateOfBirth: Date,
        gender: String,
        upId: String,
        createdDate: Date,
        email: String,
        gst: String,
        totalCharges: Number,
        rating: {
            type: Number,
            default: 0
        },
        aadharImage: [{
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        }],
        image: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
        signature: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
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
        }
    },
    { timestamps: true }
);

export default model('customer', customerSchema);
