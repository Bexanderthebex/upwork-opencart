import express from 'express';

import products from '../../controllers/products';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  //create routes here
  router.get('/getTotalOrders',
    getTotalOrders,
    returnProduct
  );
  
  router.get('/getMostSoldItems',
    getMostSoldItems,
    returnProduct
  );

  router.get('/getMostAvailableItems',
    getMostAvailableItems,
    returnProduct
  );

  router.get('/getTopProductRevenue',
    getTopProductRevenue,
    returnProduct
  );

  router.get('/getMostReturnedItems',
    getMostReturnedItems,
    returnProduct
  );

  router.get('/getMostNotifyMeItems',
    getMostNotifyMeItems,
    returnProduct
  );

  //this one still have no data in the database yet
  router.get('/getLastFourStockingReport',
    getLastFourStockingReport,
    returnProduct
  );

  //create functions here
  async function getTotalOrders(req, res, next) {
    try {
      req.item = await products.getTotalOrders();
      if (!req.item) {
        return next(new errors.NotFound('Total number of Orders not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostSoldItems (req, res, next) {
    try {
      req.item = await products.getMostSoldItems();
      if (!req.item) {
        return next(new errors.NotFound('Most sold items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostAvailableItems (req, res, next) {
    try {
      req.item = await products.getMostAvailableItems();
      if (!req.item) {
        return next(new errors.NotFound('Most available items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopProductRevenue (req, res, next) {
    try {
      req.item = await products.getTopProductRevenue();
      if (!req.item) {
        return next(new errors.NotFound('Top product revenue not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostReturnedItems (req, res, next) {
    try {
      req.item = await products.getMostReturnedItems();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostNotifyMeItems (req, res, next) {
    try {
      req.item = await products.getMostNotifyMeItems();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getLastFourStockingReport (req, res, next) {
    try {
      req.item = await products.getLastFourStockingReport();
      if (!req.item) {
        return next(new errors.NotFound('Most Returned Items not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  function returnProduct (req, res) {
    res.json(req.item);
  }

  return router;
}