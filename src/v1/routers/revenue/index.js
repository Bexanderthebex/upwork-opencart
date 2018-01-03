import express from 'express';

import revenue from '../../controllers/revenue';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  //insert router here
  router.get('/total',
    getTotalRevenue,
    returnRevenue
  );

  router.get('/category/top',
    getTopCategoryRevenue,
    returnRevenue
  );

  //insert functions here

  async function getTotalRevenue (req, res, next) {
    try {
      req.item = await revenue.getTotalRevenue();
      if (!req.item) {
        return next(
          new errors.NotFound('Total Revenue not Found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopCategoryRevenue(req, res, next) {
    try {
      req.item = await revenue.getTopCategoryRevenue();
      if (!req.item) {
        return next(
          new errors.NotFound('Top Category Revenue not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  function returnRevenue(req, res) {
    res.json(req.item);
  }

  return router;
}