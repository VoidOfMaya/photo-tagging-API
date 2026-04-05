import request from "supertest";
import express from 'express';

import {indexRouter} from './features/routes/indexRouter.js';
import { prisma } from "./lib/prisma.js";
//sets up an express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', indexRouter);
//mocks db data
beforeEach(async()=>{
    //delete all previous enteries!
    await prisma.player.deleteMany();
    await prisma.target.deleteMany();
    await prisma.map.deleteMany();
    //seed mock data
    const map = await prisma.map.create({
        data:{name: 'test_map',path: './img',pxWidth: 2000, pxHeight: 1000}
    })
    await prisma.target.createMany({
        data:[
            {targetId: 'waldo',Xpos: 2214,ypos:649, mapId: map.id},
            {targetId: 'wanda',Xpos: 1806,ypos: 84, mapId: map.id}
        ]
    })
})
afterAll(async()=>{
    await prisma.$disconnect();
})
//req:GET//score test
//expected return:
//[{playername, mapname,time},...]
test('GET/ scores', async()=>{
    //get map info:
    //mock data
    const start = new Date();
    const end = [
        new Date(start.getTime() + 5000), 
        new Date(start.getTime() + 10000),
        new Date(start.getTime() + 23000)]
    
    const map = await prisma.map.findFirst();
    await prisma.player.createMany({
        data:[
            {name: 'simon', mapId:map.id ,roundEnd: end[0],roundStart: start},
            {name: 'david', mapId:map.id ,roundEnd: end[1],roundStart: start},
            {mapId: map.id ,roundEnd: end[2],roundStart: start},
        ]
    })
    //running request against mock data
    const res = await request(app)
          .get('/')
          .expect('Content-Type', /json/)
          .expect(200);
    expect(res.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'simon', map: 'test_map', time: 5000 }),
            expect.objectContaining({ name: 'david', map: 'test_map', time: 10000 }),
            expect.objectContaining({ name: 'annonymous', map: 'test_map', time: 23000 })
        ])
    )
})
//req:POST// start round test expects{startingTime, playername!, }
//takes : {playername?, mapid} 
//expected return: playerId
//database expected to contain  a player entry with the following
// {id, mapId, name, round_start}
test('POST/start round and create new player', async ()=>{
    const map = await prisma.map.findFirst();
    const res=  await 
        request(app)
        .post('/')
        .type('form')
        .send({playername: 'david', mapId: map.id})
    const playerId = res.body.id
    expect(res.statusCode).toBe(201);
    expect(playerId).toBeDefined();
    const session = await prisma.player.findUnique({
        where:{id: playerId},
        select:{
            name: true,
            map: {select:{name: true}},
            roundStart: true,
            roundEnd: true
        }
    })
    expect(session).not.toBeNull();
    expect(session.name).toBe('david');
    expect(session.roundStart).toBeDefined();
})
//req:PUT// end game and log round if complete
//takes *req.body: {player.id}

//database expected to contain  a player entry with the following
// {..., round_End}
test('round end submition',async()=>{
    //setting up test mock data
    const map = await prisma.map.findFirst();
    await prisma.target.deleteMany();
    await prisma.target.createMany({
        data:[
            {targetId: "waldo", Xpos:865, ypos:202, mapId: map.id},
            {targetId: "wanda", Xpos:705, ypos:26, mapId: map.id},
            {targetId: "odlaw", Xpos:163, ypos:25, mapId: map.id},
            {targetId: "mermaid", Xpos:357, ypos:374, mapId: map.id}
        ]
    })
    //creats a pending game session
    const player = await prisma.player.create({
        data: {name: 'simon', mapId:map.id}
    })
    const res = await request(app)
         .put('/')
         //player id
         .send({
            playerId: player.id,
            mapId: map.id,
            screensize:{W: 2560, H: 1609},
            //db map: (X)pxWidth: 2000, (Y)pxHeight: 1000
            targets:[
        { targetId: "waldo", x: 1107, y: 323 },
        { targetId: "wanda", x: 902, y: 42 },
        { targetId: "odlaw", x: 209, y: 40 },
        { targetId: "mermaid", x: 457, y: 598 }
    ], })

    const updtSession = res.body.updtSession;
    const availablTs = await prisma.target.findMany();
    console.log(availablTs)
    
    const session = await prisma.player.findUnique({
        where:{id: Number(player.id)},
        select:{
            id: true,
            name: true,
            map: {select:{name: true}},
            roundStart: true,
            roundEnd: true
        }
    })
    console.log(session);
    expect(session).not.toBeNull();
    expect(session.name).toBe('simon');
    expect(session.roundStart).toBeDefined();
    expect(session.roundEnd).toBeDefined();
    expect(session.roundEnd).not.toBeNull();

})
// req:PUT// end round test
//post testing
//test('testing game start rout works', done=>{
    //declerative portion of a POST test
//    request(app)
//    .post('/')
//    .type('form')
//    .send({name: ''})
    //result portionn of a POST test
//    .then(()=>{
//        request(app)
//        .get('/score')
//        .expect({array: [/*score data goes here*/],done})
//    })
//})