import mongoose, { Schema, Document } from 'mongoose';


// interface Message: used to define the structure of a Message document.
// extends Document: By extending the Document interface, the Message interface inherits properties and methods from the Mongoose Document interface.
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Schema<Message>: specifies the type of the Mongoose schema being created.
const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,

        //  the required field can take either a boolean value or an array with two elements. When an array is used, the first element is a boolean that specifies whether the field is required or not, and the second element is a custom error message to be displayed if the field is not provided.
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },

    // messeages field is an array that contains MessageSchema documents.
    messages: [MessageSchema],
});


// If the 'User' model (of type <User>) already exist, you can access it using mongoose.models.User instead of creating a new model.

// mongoose.model<User>('User', UserSchema): it creates a Mongoose model named 'User'( of type <User>) based on the UserSchema schema definition, and assigns the resulting model to the userModel variable.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;