import express from "express"
import bootstrap from "./src/app.controller.js"

const app = express()
const port = process.env.PORT || 3001


bootstrap(app,express)


app.listen(port,()=>{
    console.log("sever connected on port 3000");
})