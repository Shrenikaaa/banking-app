import mongoose from "mongoose";
//the transcation schema is an embedded document
const transactionSchema = new mongoose.Schema({
    tsnId:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        enum:['deposit','withdraw','transfer'],
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:['pending','success','failed'],
        default:"success"
    },

});

//The main Account schema

const accountSchema = new mongoose.Schema({
    accountNumber:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{

        type:String,
        enum:['savings','current'],
        required:true
    },
    balance:{
        type:Number,
        default:0,
        required:true
    },
    status:{
        type:String,
        enum:['active','frozen','closed'],
        default:"active"
    },
    transactions:[transactionSchema], //The embedded array of transactions
});

export const Account = mongoose.model("Account",accountSchema);
export const Transaction = mongoose.model("Transaction",transactionSchema);

export default{Account,Transaction};