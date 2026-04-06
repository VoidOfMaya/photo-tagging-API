import {prisma} from '../lib/prisma.js'
const getSessionStatus = async(id)=>{
    return await prisma.player.findUnique({
        where:{id: id},
        select:{
            roundEnd: true
        }
    })
}
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
const getScore = async(id)=>{
    return await prisma.player.findMany({
        where: {mapId: id, roundEnd:{ not: null}},
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
const closeSession = async(sessionId)=>{
    //if all targets are within 50px radius then:
    //close game session
    return await prisma.player.update({
        where:{id : Number(sessionId), roundEnd: null},
        data:{
            roundEnd: new Date()
        }
    })
}
const createSession = async(data)=>{
    let returnData;
    if(data.playername){
        returnData = await prisma.player.create({
            data:{
                name: data.playername,
                map: {connect:{id: Number(data.mapId) }}
            }
        })        
    }else{
        returnData = await prisma.player.create({
            data:{
                map:{connect:{id: Number(data.mapId)}}
            }
        })
    }
    return returnData
}
export{
    getScore,
    getSessionStatus,
    getTargetsAndMap,
    closeSession,
    createSession
}