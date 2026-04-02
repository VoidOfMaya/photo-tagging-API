import request from "supertest";
import express from 'express';

import {indexRouter} from './features/routes/indexRouter.js';
import { prisma } from "./lib/prisma.js";
//sets up an express server
const app = express();
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
        data:{name: 'test_map',path: './img',pxHeight: 500,pxWidth: 1000}
    })
    await prisma.target.createMany({
        data:[
            {targetId: 'waldo',Xpos: 500,ypos:100, mapId: map.id},
            {targetId: 'wanda',Xpos: 800,ypos: 400, mapId: map.id}
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

    const map = await prisma.map.findFirst();
    const end = new Date (Date.now()+ 5000);
    await prisma.player.create({
        data: {name: 'simon', mapId:map.id ,roundEnd: end}
    })
    const res = await request(app)
         .put('/')
         //player id
         .send({
            playerId: 1,
            mapId: map.id,
            screensize:{W:1000, H:500},
            targets: [
                {targetId: "waldo", x:865,y:202},
                {targetId: "wanda", x:705,y:26},
                {targetId: "odlaw", x:163,y:25},
                {targetId: "mermaid", x:357,y:374}
            ], })
            /*expect: 
             {targetId: "waldo", x:2214,y:649},
                {targetId: "wanda", x:1806,y:84},
                {targetId: "odlaw", x:418,y:79},
                {targetId: "mermaid", x:913,y:1204}
            */
    const playerId = res.body.id;
    expect(playerId)
    .toBeDefined()
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
    expect(session.name).toBe('simon');
    expect(session.roundStart).toBeDefined();
    expect(session.roundEnd).toBeDefined();

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