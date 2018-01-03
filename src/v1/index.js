/* 
  TODO:
    - ADD middleware for admin account authentication for the API's
*/

import express from 'express';

//import routers
import user from './routers/user';
import products from './routers/products';
import revenue from './routers/revenue';

// declare routers here
export default function () {
  var router = express.Router();

  router.use('/user', user());
  router.use('/products', products());
  router.use('/revenue', revenue());

  return router;
}
