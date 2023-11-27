import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// con esta linea se encrypta las credenciales de la base de datos 
const URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.9vhlkqi.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

await mongoose.connect(URL, {serverSelectionTimeoutMS: 3000, })
    .then(() => console.log("Base de datos conectada con exito"))
    .catch(e => console.log(e));







