
import { 
    getScore, 
    getSessionStatus,
    getTargetsAndMap,
    createSession,
    closeSession
 } from '../prismaQueries.js'
//start session// should recieve: name and map id session round updates automatically
const startGame = async(data)=>{
    if(!data.playername || !data.mapId) throw new Error("missing data!")
     return createSession(data);
}
//end session// updates existing query with  end time
const gameLogicService = async(data)=>{
    const {playerId,mapId,screensize,targets}= data;
    const targs = await getTargetsAndMap(mapId);
    let hitcounter = 0;
    const ogMap = targs[0].map;
        
    targets.forEach((target) => {
        //1- normlize target cords to match with the original scale of the img
        const newY = target.y*(ogMap.pxHeight/screensize.H);
        const newX = target.x*(ogMap.pxWidth/screensize.W);
        //2- check if target name id exists
        const match = targs.find(t => t.targetId === target.targetId);
        if(!match) return;
        //3-check hight and width within 50px margin
        const dx = match.Xpos - newX;
        const dy = match.ypos - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
         if(distance <= 50) return hitcounter = hitcounter + 1;
        
        
    });
        //4- once all targets are found end session     
    if(hitcounter !== targs.length) throw new Error('one or more invalide targets!');
    const sessStatus = await getSessionStatus(Number(playerId));
    if(sessStatus.roundEnd !== null) throw new Error('Session has already concluded')
    return closeSession(playerId);
}

//get score// gets player name,session start, session end , map name, 
const score = async(mapId)=>{
    return await getScore(mapId);
}
//get map info// gets original map deminsions and targets with thier coords

export{
    getTargetsAndMap,
    startGame,
    gameLogicService,
    score,
    getSessionStatus

}