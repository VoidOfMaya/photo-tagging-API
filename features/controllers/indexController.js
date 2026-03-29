import { 
    score,
    startGame,
    endGame,
    mapCoords
} from "../services/indexServices.js"
//sets session start
//expects {playername: 'david', mapId: map.id}
const gameStartController = async(req, res)=>{
    const data = req.body;
    const session = await startGame(data)
    res.status(201).json(session);
    //res.json({msg:"post rout accessed"})
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