import { 
    score,
    startGame,
    endGame,
    mapCoords
} from "../services/indexServices.js"
//sets session start
const gameStartController = async(req, res)=>{
    
}
//validate game results // recieves: 
// {game screen hight&width}
// [{targetId, xposition,yposition}...], 
const gameEndController = async(req, res)=>{
    
}
//gets all scors with an endgame time
//if  score does not have an end time  then delete
const scoreController = async(req, res)=>{
 res.json({"msg": 'rout reached'})
}

export{
    gameStartController,
    gameEndController,
    scoreController
}