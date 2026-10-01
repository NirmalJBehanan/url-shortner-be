import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connection from "./database/dbConfig.js"
import urlRouter from "./router/url.router.js"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json());
connection()
app.use("/api",urlRouter)
app.listen(process.env.PORT,()=>{
    console.log("server connected")
})