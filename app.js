import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { indexRouter } from './routes/indexRouter.js';

 const app = express()

 app.use(cors());

 //parse req string to json

 app.use(express.json());
 app.use(express.urlencoded({extended: true}));

 app.use('/', indexRouter)

 app.use((req, res, next)=>{
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
 })
// 404 not found error
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
//500 server error
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err)=>{
    if(err) throw new err ;
    console.log(`Server running on port: ${PORT}`);
})
