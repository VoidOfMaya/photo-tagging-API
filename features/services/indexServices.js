import {prisma} from '../../lib/prisma.js'
const submitRound = async(data)=>{
    console.log(data)
}
//start session// should recieve: name and map id session round updates automatically
const startGame = async(data)=>{
    let session;
    if(data.name){
        session = await prisma.player.create({
            data:{
                name: data.name,
                map: {where:{id: data.mapId }}
            }
        })        
    }else{
         session = await prisma.player.create({
            data:{
                map:{where:{id: data.mapId}}
            }
        })
    }
    return session

}
//end session// updates existing query with  end time
const endGame = async(sessionId)=>{
    await prisma.player.update({
        where:{id : sessionId},
        data:{
            roundEnd: new Date()
        }
    })
}
//get score// gets player name,session start, session end , map name, 
const score = async(mapId)=>{
    return await prisma.player.findMany({
        where: {mapId: mapId},
        select:{
            name: true,
            roundStart: true,
            roundEnd: true,
            map:{
                select:{
                    name: true,

                }
            }
        }
    })
}
//get map info// gets original map deminsions and targets with thier coords
const MapCoords = async(mapId)=>{
    return await prisma.map.findUnique({
        where:{id : mapId},
        select:{
            pxHeight: true,
            pxWidth: true,
            targets:{
                select:{
                    targetId:true,
                    Xpos: true,
                    ypos: true
                }
            }
        }
    })
}
export{
    submitRound,
    startGame,
    endGame,
    score,
}