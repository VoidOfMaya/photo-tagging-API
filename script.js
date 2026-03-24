import {prisma} from './lib/prisma.js';

const seed = async() =>{
    //seed base data
    const map = await prisma.map.create({
        data:{
            name: 'dungeons',
            pxWidth: 2560,
            pxHeight: 1609,
            path: './src/assets/photos/Waldo-Underground.jpg'
        },
    })
    await prisma.target.createMany({
        data: [
            {targetId: 'waldo', Xpos: 2214, ypos: 649, mapId: map.id},
            {targetId: 'wanda', Xpos: 1806, ypos: 84, mapId: map.id},
            {targetId: 'odlaw', Xpos: 418, ypos: 79, mapId: map.id},
            {targetId: 'mermaid', Xpos: 913, ypos: 1204, mapId: map.id},
        ],
        skipDuplicates: true
    })
}  
seed().catch((e)=>{
    console.log(e);
    process.exit(1)
})
.finally(async () =>{
    await prisma.$disconnect();
}) 
//example query:
/*
async function main(){
    await prisma.role.createMany({
        data:[
            {name: 'user'},
            {name: 'author'}
        ],
        skipDuplicates: true
    });
    console.log('Roles seeded')
}
main().catch((e)=>{
    console.log(e);
    process.exit(1);
})
.finally(async ()=>{
    await prisma.$disconnect();
});
 */