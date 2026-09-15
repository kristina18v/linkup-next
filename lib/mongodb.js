import mongoose from "mongoose";

export default async function connectDB() {

    const MONGODB_URL = process.env.MONGODB_URL;

    if(!MONGODB_URL) {
        throw new Error ("MONGODB_URL is not defined");
    }

    if(mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    return mongoose.connect (MONGODB_URL);
    
}