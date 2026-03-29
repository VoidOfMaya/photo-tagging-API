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
    const result = await score(); 

    const scoreArray = result.map(sess =>(
        { name: sess.name, map: sess.map.name, time: (sess.roundEnd - sess.roundStart) }
    ));
    console.log( typeof scoreArray);
 res.json(scoreArray)
}

export{
    gameStartController,
    gameEndController,
    scoreController
}