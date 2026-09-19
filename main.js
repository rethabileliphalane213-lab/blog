const express=require("express")
const app=express()
require("dotenv").config

console.log(process.env.DATABASE_URL)


const port=process.env.PORT||3000

app.listen(port,()=>{
    console.log("port is running")
})