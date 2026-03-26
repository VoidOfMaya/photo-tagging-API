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
    await prisma.map.deleteMany();
    await prisma.target.deleteMany();
    //seed mock data
    await prisma.map.create({
        data:{name: 'test_map',path: './img',pxHeight: 500,pxWidth: 1000}
    })
    await prisma.target.createMany({
        data:[
            {targetId: 'waldo',Xpos: 500,ypos:100, mapId: 1},
            {targetId: 'wanda',Xpos: 800,ypos: 400, mapId: 1}
        ]
    })
})
afterAll(async()=>{
    await prisma.$disconnect();
})
//req:GET//score test
//expected return:
//[{playername, mapname,time},...]
test('GET/ scores', done =>{
    request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(/*score data goes here*/ {"msg": 'rout reached'})
    .expect(200, done);
})
//req:POST// start round test expects{startingTime, playername!, }
//takes : {playername?, mapid} 
//expected return: playerId
//database expected to contain  a player entry with the following
// {id, mapId, name, round_start}
test('POST/start round and create new player', async ()=>{
    const res=  await 
        request(app)
        .post('/')
        .type('form')
        .send({playername: 'david', mapId: 1})
    expect(res.statusCode).toBe(201);
    expect(res.body.playerId).toBeDefined();
    const session = await prisma.player.findUnique({
        where:{id: 1},
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
test('round end submition',done=>{

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