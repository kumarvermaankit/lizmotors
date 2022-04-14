const mongoose=require("mongoose")

const EPinSchema=new mongoose.Schema({

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
toe:{
type:String,
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


module.exports=mongoose.model("EPin",EPinSchema )