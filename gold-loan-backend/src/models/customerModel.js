import { Schema, model } from 'mongoose';
import { stringify } from 'uuid';

const customerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        address: String,
        place: String,
        state: String,
        pin: Number,
        nearBy: String,
        primaryNumber: String,
        careOf: String,
        secondaryNumber: String,
        aadhar: String,
        email: String,
        gst: String,
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
    },
    { timestamps: true }
);

export default model('customer', customerSchema);
