const mongoose=require("mongoose")

const EvtPinSchema=new mongoose.Schema({

   username:{
       type:String,
       require:true,
       
   },
   title:{
    type:String,
    require:true,
    
},
desc :{
    type:String,
    require:true,
    
},
date:{
type:Date,
default:null
},
lat:{
    type:Number,
    require:true
},
lang:{
    type:Number,
    require:true
},
notify:[],
pintype:{
    type:"String"
}


 

},{timestamps:true})


module.exports=mongoose.model("EvtPin",EvtPinSchema )