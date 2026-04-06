import { Router } from "express";
import { 
    gameStartController,
    gameEndController, 
    scoreController 
} from "../controllers/indexController.js";
import {validateEnd, validateStart } from "../validate.js";

const indexRouter = Router()
//expected functionality:
// get/score
// start round and set timer(timer should account for communications delays);
// validate round , on success submit round info stop timer and populate score

indexRouter.get('/',scoreController)
/*returns array of objects=[
{(playername? name : anon), mapname, (starttime - endtime = time)},
]*/
indexRouter.post('/',validateStart,gameStartController)
/*req.body: {playername?, mapid} 
note: start time is set by default on round/game session creation
    returns: player id (this is used to track game session)
*/
indexRouter.put('/', validateEnd,gameEndController)
/*req.body: {player.id}
    returns 200ok
note: endgame logic is handled by services
*/

export{
    indexRouter
}