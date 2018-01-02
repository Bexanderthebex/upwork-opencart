import express from 'express';

//import routers
import user from './routers/user';

// declare routers here
export default function () {
  var router = express.Router();

  router.use('/user', user());
  // router.use('/items', items());

  return router;
}
