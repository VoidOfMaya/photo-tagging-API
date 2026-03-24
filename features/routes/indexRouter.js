import { Router } from "express";
import { 
    roundController, 
    scoreController 
} from "../controllers/indexController";
import { roundData } from "../validate";

const indexRouter = Router()
//expected functionality:
// get/score
// start round and set timer(timer should account for communications delays);
// validate round , on success submit round info stop timer and populate score

indexRouter.get('/',scoreController)
indexRouter.post('/registerRound',roundData ,roundController)

export{
    indexRouter
}