import express from 'express';

//import routers
import user from './routers/user';
import products from './routers/products';

// declare routers here
export default function () {
  var router = express.Router();

  router.use('/user', user());
  router.use('/products', products());

  return router;
}
