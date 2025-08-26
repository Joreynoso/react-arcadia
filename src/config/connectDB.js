import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const mongo_uri = process.env.MONGO_URI || ""

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri)
    console.log("--> [DATABASE] Conectado a MongoDB")
    console.log("--> [DATABASE] contectado a:" , mongo_uri)
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message)
    process.exit(1)
  }
}

export default connectDB
