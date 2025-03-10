const mongoose = require("mongoose")

const connectingDB=async()=>{
    try{
        const connecting = await mongoose.connect(`${process.env.MONGO_DB_URL}`)
        console.log(`Connected!  ${connecting.connection.host}`)
    } catch(error){
        console.error("Could not connect",error)
    }
}
module.exports=connectingDB