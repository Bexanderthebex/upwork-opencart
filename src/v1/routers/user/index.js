import express from 'express';

import user from '../../controllers/user';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  router.get('/findUniqueUser',
    findUniqueUser,
    returnUser
  );

  async function findUniqueUser (req, res, next) {
    try {
      req.item = await user.findUniqueUsers();
      if (!req.item) {
        return next(new errors.NotFound('Item not found'));
      }
      console.log(req.item);
      next();
    } catch (err) {
      next(err);
    }
  }

  function returnUser (req, res) {
    // console.log({result: res});
    // console.log(res);
    res.json(req.item);
  }

  return router;
}