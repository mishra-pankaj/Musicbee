const mongoose = require('mongoose');
async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected Sucessfully!!!");
        
    }
    catch(err){
        console.log("Db Connection error",err);
    }
}
module.exports = connectDb;
