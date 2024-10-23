import { Schema, model } from 'mongoose';

const goldItemSchema = new Schema(
    {
        goldItem: String,
        goldDescription: String,
        goldImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
    },
    { timestamps: true }
);

export default model('goldItem', goldItemSchema);
