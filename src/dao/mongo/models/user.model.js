import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema(
    {
        firstName:String,
        lastName:String,
        email:String,
        age:Number,
        password:String,
        role:
        {
            type:String,
            enum:['user','userPremium','admin'],
            default: 'user'
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'cart'
        }
    }
)

const userModel = mongoose.model(collection, schema);

export default userModel;