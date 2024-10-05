import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    imageURL: string;
    isAdmin: Boolean;
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, 
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            default: 'empty',
        },
        isAdmin : {
            type: Boolean,
            default : false,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>('users', userSchema);
export default User;