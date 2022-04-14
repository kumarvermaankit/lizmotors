const mongoose=require("mongoose")

const RoomSchema=new mongoose.Schema({
 RoomName:{
     type:"String",
},
messages:{
    type:Array,
    default:[]
}

})

module.exports=mongoose.model("MessageRoom",RoomSchema )