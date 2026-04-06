import {prisma} from '../../lib/prisma.js'
//start session// should recieve: name and map id session round updates automatically
const startGame = async(data)=>{
    if(!data.playername || !data.mapId) throw new Error("missing data!")
    if(data.playername){
        return await prisma.player.create({
            data:{
                name: data.playername,
                map: {connect:{id: Number(data.mapId) }}
            }
        })        
    }else{
        return await prisma.player.create({
            data:{
                map:{connect:{id: Number(data.mapId)}}
            }
        })
    }
}
//end session// updates existing query with  end time
const endGame = async(sessionId)=>{
    //if all targets are within 50px radius then:
    //close game session
    return await prisma.player.update({
        where:{id : Number(sessionId), roundEnd: null},
        data:{
            roundEnd: new Date()
        }
    })
}
//get score// gets player name,session start, session end , map name, 
const score = async(mapId)=>{
    return await prisma.player.findMany({
        where: {mapId: mapId, roundEnd:{ not: null}},
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
    //for each score derive round time by subtracting start and end date
}
//get map info// gets original map deminsions and targets with thier coords
const getTargetsAndMap = async(mapId)=>{
    return await prisma.target.findMany({
        where:{mapId : Number(mapId)},
        select:{                    
            targetId:true,
            Xpos: true,
            ypos: true,
            map:{
                select:{
                    pxHeight: true,
                    pxWidth: true,

                }
            }
        }
    })
}
const getSessionStatus = async(id)=>{
    return await prisma.player.findUnique({
        where:{id: id},
        select:{
            roundEnd: true
        }
    })
}
export{
    getTargetsAndMap,
    startGame,
    endGame,
    score,
    getSessionStatus

}