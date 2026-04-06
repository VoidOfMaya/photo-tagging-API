import { matchedData, validationResult } from "express-validator";
import { 
    score,
    startGame,
    gameLogicService
} from "../services/indexServices.js"
//sets session start
//expects {playername: 'david', mapId: map.id}
const gameStartController = async(req, res)=>{
    //validating input data
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({error: errors.array()});
    const data = matchedData(req)
    
    try{
        const session = await startGame(data)
        res.status(201).json(session);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message || 'Internal Server Error'});
    }
}
//validate game results // recieves: 
// {game screen hight&width}
// [{targetId, xposition,yposition}...], 
const gameEndController = async(req, res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({error: errors.array()});
    const data = matchedData(req)
    //stitch todether sanetized data with complex data
    const pardsedData = {
        playerId: data.playerId,
        mapId: data.mapId,
        screensize: req.body.screensize,
        targets: req.body.targets 
    }

    try{
        const updtSession = await gameLogicService(pardsedData)   
        console.log(updtSession);
        res.status(200).json({status: true, session: updtSession})
        
    }catch(err){
        res.status(400).json({status: false,ErrMsg: err.message || err})
    }
}
//gets all scors with an endgame time
//if  score does not have an end time  then delete
const scoreController = async(req, res)=>{

    const result = await score(); 

    const scoreArray = result.map(sess =>(
        { name: sess.name, map: sess.map.name, time: (sess.roundEnd - sess.roundStart) }
    ));
 res.json(scoreArray)
}

export{
    gameStartController,
    gameEndController,
    scoreController
}