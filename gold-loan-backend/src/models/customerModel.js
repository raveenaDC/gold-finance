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
        careOf: String,
        secondaryNumber: String,
        aadhar: String,
        email: String,
        gst: String,
        rating: {
            type: Number,
            default: 0
        },
        aadharImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
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
        bankUserName: String,
        bankAccount: Number,
        ifsc: String,
        bankName: String
    },
    { timestamps: true }
);

export default model('customer', customerSchema);
