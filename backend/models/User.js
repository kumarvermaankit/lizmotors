 const mongoose=require("mongoose")
 const encrypt=require("mongoose-encryption")
 require("dotenv").config()
 const UserSchema=new mongoose.Schema({

    username:{
        type:String,
        require:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        require:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:5,
    },
    lang:{
        type:Number,
    },
    lat:{
        type:Number 
    },
    profile:{
        type:"String"
        
    },
    thoughtofday:{
        type:"String",
        default:"Be happy"
    },
    status:[],
    Bio:{
        type:"String",
        default:"Not available"
    },
    




 },{timestamps:true})
//  const secret=process.env.MYSECRET;
//  UserSchema.plugin(encrypt, {  secret:secret,excludeFromEncryption:['username','email',"lang","lat"] });
 module.exports=mongoose.model("User",UserSchema )