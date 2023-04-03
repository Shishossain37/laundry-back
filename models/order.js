const mongoose = require('mongoose');
// const User = mongoose.model("User")
const {ObjectId} = mongoose.Schema.Types
const orderSchema = mongoose.Schema({
    product:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    service:{
        type:Array,
        required:true
    },
    price:{
        type:Number
    },
    createdBy:{
        type:ObjectId,
        ref:"User"
    }
   

})
mongoose.model("CreateOrder",orderSchema)