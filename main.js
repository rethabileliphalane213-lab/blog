const express=require("express")
const app=express()
require("dotenv").config()
const cors=require("cors")




app.use(express.urlencoded({extended:true}))
app.use(express.json())

const signinRouter=require("./routes/signinRoute")
app.use("/signin",signinRouter)

const port=process.env.PORT||3000

app.listen(port,()=>{
    console.log("port is running")
})