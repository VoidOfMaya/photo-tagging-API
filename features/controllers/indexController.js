import { 
    score,
    startGame,
    endGame,
    getTargetsAndMap
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
    const [playerId,mapId,screensize,targets] = req.body;
    const targs = await getTargetsAndMap(mapId);
    let hitcounter = 0;
    const ogMap = targs[0].map;
    targets.forEach(target => {
    
    //1- normlize target cords to match with the original scale of the img
    const newY = target.y*(ogMap.pxHeight/screensize.H);
    const newX = target.x*(ogMap.pxWidth/screensize.W);
    //2- check if target name id exists
    const match = targs.find(t => t.targetId === target.targetId);
    if(!match) return;
    //3-check hight and width within 50px margin
    const dx = t.Xpos - newX;
    const dy = t.ypos - newY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if(distance <= 50) return hitcounter++
    
    });
    //4- once all targets are found end session     
    if(hitcounter === targs.length){
        res.status(200)
    }else{
        res.status(400)
    }
    /*
    example target:
        {targetId: "waldo", x:865,y:202},
    expect conversion: 
        {targetId: "waldo", x:2214,y:649},
    */
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