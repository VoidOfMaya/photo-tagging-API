import { Router } from "express";

const indexRouter = Router()

indexRouter.get('/',(req,res)=>{
    console.log('endpoint indexRouter reached')
})

export{
    indexRouter
}