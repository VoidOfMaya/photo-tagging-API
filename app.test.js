import supertest from "supertest";
import express, { request } from 'express';

import {indexRouter} from './features/routes/indexRouter.js';

const app = express();
app.use(express.urlencoded({extended: false}));
app.use('/', indexRouter);

//get testing
test('index router works', done =>{
    request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(/*score data goes here*/ {})
    .expect(200, done);
})
//post testing
test('testing game start rout works', done=>{
    //declerative portion of a POST test
    request(app)
    .post('/')
    .type('form')
    .send({name: ''})
    //result portionn of a POST test
    .then(()=>{
        request(app)
        .get('/score')
        .expect({array: [/*score data goes here*/],done})
    })
})